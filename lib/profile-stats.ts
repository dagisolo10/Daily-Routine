import { differenceInDays } from "date-fns";
import { dexie, Profile, ProfileMilestones, TaskAchievementLabel } from "./db";

export const profileStats = async () => {
    const profile = await dexie.profile.toCollection().first();
    if (!profile) return null;

    const [details, milestones, badgeCount, insights] = await Promise.all([getProfileDetails(profile), getMilestones(profile), getBadges(), getInsights(profile)]);

    return { ...details, ...milestones, ...badgeCount, ...insights };
};

async function getProfileDetails(profile: Profile) {
    return {
        name: profile?.name,
        age: profile?.age,
        joinedAt: profile?.createdAt,
        perfectDays: profile?.perfectDays || 0,
        longestStreak: profile?.longestStreak || 0,
        currentStreak: profile?.currentStreak || 0,
    };
}

async function getMilestones(profile: Profile) {
    const achieved = Object.entries(ProfileMilestones).filter(([days]) => (profile?.longestStreak || 0) >= Number(days));

    return { achieved, milestones: Object.entries(ProfileMilestones) };
}

async function getBadges() {
    const taskAchievements = await dexie.taskAchievement.toArray();

    const count = taskAchievements.reduce(
        (acc, curr) => {
            acc[curr.label] = (acc[curr.label] || 0) + 1;
            return acc;
        },
        { Gold: 0, Silver: 0, Bronze: 0 } as Record<TaskAchievementLabel, number>,
    );

    const totalCount = Object.entries(count).reduce((acc, [, days]) => acc + days, 0);

    return { totalCount, count };
}

async function getInsights(profile: Profile) {
    const allTasks = await dexie.task.orderBy("streak").toArray();
    const maxStreak = allTasks.length > 0 ? allTasks[allTasks.length - 1].streak : 0;

    const winners = allTasks.filter((task) => task.streak === maxStreak && maxStreak > 0);
    const dominantTask = winners[0] || null;
    const tieCount = winners.length > 1 ? winners.length - 1 : 0;
    const otherHabits = winners
        .slice(1)
        .map((task) => task.name)
        .join(", ");

    const daysSinceJoined = Math.max(1, differenceInDays(new Date(), profile.createdAt));
    const completionRate = Math.min(Math.round((profile.perfectDays || 0) / daysSinceJoined) * 100, 100);

    const nextMilestoneEntry = Object.entries(ProfileMilestones).find(([days]) => (profile.longestStreak || 0) < Number(days));

    const nextAchievement = nextMilestoneEntry ? { label: nextMilestoneEntry[1], daysRemaining: Math.max(0, Number(nextMilestoneEntry[0]) - (profile.currentStreak || 0)) } : null;

    return {
        dominantTask: dominantTask?.name,
        otherHabits,
        tieCount,
        completionRate,
        nextAchievement,
    };
}
