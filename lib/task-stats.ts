import { addDays, differenceInDays, endOfDay, endOfWeek, startOfDay, startOfWeek } from "date-fns";
import { dexie, ProfileMilestones } from "./db";
import { totalTaskCount } from "./actions";

export const taskStats = async () => {
    const [totalTasks, completedToday, weeklyProgress, { currentStreak, longestStreak }, consistency] = await Promise.all([
        totalTaskCount(endOfDay(new Date())),
        getCompletedTodayCount(),
        calculateWeeklyProgress(),
        getStreaks(),
        calculateTotalConsistency(),
    ]);

    return { totalTasks, completedToday, weeklyProgress, currentStreak, longestStreak, nextAchievement: getNextAchievement(longestStreak), consistency };
};

async function getCompletedTodayCount() {
    const today = startOfDay(new Date());
    return dexie.taskLog.where("date").equals(today).count();
}

async function getStreaks() {
    const profile = await dexie.profile.toCollection().first();

    if (!profile) return { currentStreak: 0, longestStreak: 0 };

    return { currentStreak: profile.currentStreak || 0, longestStreak: profile.longestStreak || 0 };
}

function getNextAchievement(streak: number) {
    return Object.entries(ProfileMilestones).find(([days]) => streak < Number(days))?.[1];
}

async function calculateWeeklyProgress() {
    const today = startOfDay(new Date());
    const start = startOfWeek(today);
    const end = endOfWeek(today);

    const [logs, tasks] = await Promise.all([dexie.taskLog.where("date").between(start, end, true, true).count(), dexie.task.toArray()]);

    let totalPossibleLogs = 0;

    for (let i = 0; i < 7; i++) {
        const day = addDays(start, i);
        if (day > today) break;

        totalPossibleLogs += tasks.filter((task) => startOfDay(task.createdAt) <= day).reduce((acc, curr) => acc + curr.frequency, 0);
    }

    return totalPossibleLogs > 0 ? Math.round((logs / totalPossibleLogs) * 100) : 0;
}

export async function calculateTotalConsistency() {
    const profile = await dexie.profile.toCollection().first();
    if (!profile) return 0;

    const start = startOfDay(profile.createdAt);
    const today = startOfDay(new Date());
    const totalDays = differenceInDays(today, start) + 1;

    const [allTasks, allLogs] = await Promise.all([dexie.task.toArray(), dexie.taskLog.toArray()]);

    let totalPercentage = 0;

    for (let i = 0; i < totalDays; i++) {
        const currentTime = addDays(start, i).getTime();

        const tasksOnDay = allTasks.filter((task) => startOfDay(task.createdAt).getTime() <= currentTime).reduce((acc, curr) => acc + curr.frequency, 0);
        if (tasksOnDay === 0) continue;

        const logsOnDay = allLogs.filter((log) => startOfDay(log.date).getTime() === currentTime).length;

        totalPercentage += (logsOnDay / tasksOnDay) * 100;
    }

    return Math.round(totalPercentage / totalDays);
}
