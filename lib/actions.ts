"use client";
import { AchievementLabel, dexie, AchievementMilestones } from "./db";
import { addDays, differenceInDays, startOfDay } from "date-fns";

export async function AddTask(name: string) {
    const task = { name, createdAt: new Date(), streak: 0 };

    await dexie.task.add(task);
}

export async function DeleteTask(id: number) {
    await dexie.transaction("rw", dexie.task, dexie.taskLog, dexie.achievement, async () => {
        await dexie.task.delete(id);

        await dexie.taskLog.where("taskId").equals(id).delete();

        await dexie.achievement.where("taskId").equals(id).delete();
    });
}

export async function MarkTaskAsCompleted(taskId: number) {
    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);

    await dexie.transaction("rw", dexie.task, dexie.taskLog, dexie.profile, dexie.achievement, async () => {
        const isAlreadyMarked = await dexie.taskLog.where("[taskId+date]").equals([taskId, today]).first();

        if (isAlreadyMarked) return;

        const task = await dexie.task.get(taskId);

        if (!task) return;

        const latestLog = await dexie.taskLog.where("taskId").equals(taskId).last();

        let newStreak = 1;

        if (latestLog) {
            const lastLoggedAt = startOfDay(latestLog.date);
            const diff = differenceInDays(today, lastLoggedAt);

            if (diff === 1) newStreak = task.streak + 1;
            else if (diff === 0) return;
        }

        await dexie.taskLog.add({ taskId, date: today });
        await dexie.task.update(taskId, { streak: newStreak });

        const tasks = await dexie.task.count();
        const logsToday = await dexie.taskLog.where("date").equals(today).count();
        const isPerfectDay = tasks === logsToday;

        if (isPerfectDay) {
            const profile = await dexie.profile.toCollection().first();

            if (profile && profile.id) {
                const lastLog = await dexie.taskLog.where("date").equals(yesterday).count();
                const newCurrentStreak = lastLog === tasks ? (profile.currentStreak || 0) + 1 : 1;
                const newLongestStreak = Math.max(newCurrentStreak, profile.longestStreak || 0);

                await dexie.profile.update(profile.id, { currentStreak: newCurrentStreak, longestStreak: newLongestStreak });
            }
        }

        await getBadge(taskId);
    });
}

export async function getBadge(taskId: number) {
    const task = await dexie.task.get(taskId);
    if (!task) return [];

    const achievements: AchievementLabel[] = [];

    await dexie.transaction("rw", dexie.achievement, async () => {
        const bronze = await dexie.achievement.where("[taskId+label]").equals([taskId, "Bronze"]).first();

        if (!bronze && task.streak >= AchievementMilestones.Bronze) {
            achievements.push("Bronze");
            await dexie.achievement.add({ taskId, label: "Bronze", date: new Date() });
        }

        const silver = await dexie.achievement.where("[taskId+label]").equals([taskId, "Silver"]).first();

        if (!silver && task.streak >= AchievementMilestones.Silver) {
            achievements.push("Silver");
            await dexie.achievement.add({ taskId, label: "Silver", date: new Date() });
        }

        const gold = await dexie.achievement.where("[taskId+label]").equals([taskId, "Gold"]).first();

        if (!gold && task.streak >= AchievementMilestones.Gold) {
            achievements.push("Gold");
            await dexie.achievement.add({ taskId, label: "Gold", date: new Date() });
        }
    });

    return achievements;
}
