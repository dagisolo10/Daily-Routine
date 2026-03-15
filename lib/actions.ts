"use client";
import { TaskAchievementLabel, dexie, TaskMilestones } from "./db";
import { addDays, differenceInDays, endOfDay, startOfDay } from "date-fns";

export async function AddTask(name: string, frequency: number) {
    const task = { name, createdAt: new Date(), streak: 0, frequency: frequency || 1 };

    await dexie.task.add(task);
}

export async function DeleteTask(id: number) {
    await dexie.transaction("rw", dexie.task, dexie.taskLog, dexie.taskAchievement, async () => {
        await dexie.task.delete(id);
        await dexie.taskLog.where("taskId").equals(id).delete();
        await dexie.taskAchievement.where("taskId").equals(id).delete();
    });
}

export async function totalTaskCount(date: Date) {
    const tasks = await dexie.task.where("createdAt").belowOrEqual(date).toArray();
    return tasks.reduce((acc, curr) => acc + curr.frequency, 0);
}

export async function earlyTaskCount(date: Date) {
    const tasksYesterday = await dexie.task.where("createdAt").belowOrEqual(date).toArray();
    return tasksYesterday.reduce((acc, curr) => acc + curr.frequency, 0);
}

export async function MarkTaskAsCompleted(taskId: number) {
    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);

    await dexie.transaction("rw", dexie.task, dexie.taskLog, dexie.profile, dexie.taskAchievement, async () => {
        const task = await dexie.task.get(taskId);
        if (!task) return;

        const completedToday = await dexie.taskLog.where("[taskId+date]").equals([taskId, today]).count();
        if (completedToday >= task.frequency) return;

        await dexie.taskLog.add({ taskId, date: today });
        const newCompletedCount = completedToday + 1;

        let updatedStreak = task.streak;
        const isCompleteDay = newCompletedCount === task?.frequency;

        if (isCompleteDay) {
            const latestLogBeforeToday = await dexie.taskLog
                .where("taskId")
                .equals(taskId)
                .and((log) => log.date < today)
                .last();

            if (latestLogBeforeToday) {
                const lastCompletedAt = startOfDay(latestLogBeforeToday.date);
                const diff = differenceInDays(today, lastCompletedAt);

                updatedStreak = diff === 1 ? task.streak + 1 : 1;
            } else {
                updatedStreak = 1;
            }
            await dexie.task.update(taskId, { streak: updatedStreak });
        }

        const taskCountToComplete = await totalTaskCount(endOfDay(new Date()));
        const todaysLogCount = await dexie.taskLog.where("date").equals(today).count();
        const isPerfectDay = todaysLogCount >= taskCountToComplete;

        if (isPerfectDay) {
            const profile = await dexie.profile.toCollection().first();

            if (profile && profile.id) {
                const lastUpdate = profile.lastStreakUpdate ? startOfDay(profile.lastStreakUpdate).getTime() : 0;
                const todayTime = today.getTime();

                if (lastUpdate < todayTime) {
                    const yesterdaysRequiredTasks = await earlyTaskCount(yesterday);
                    const doneYesterday = await dexie.taskLog.where("date").equals(yesterday).count();

                    const isStreakContinuing = doneYesterday > 0 && doneYesterday >= yesterdaysRequiredTasks;

                    const newCurrentStreak = isStreakContinuing ? (profile.currentStreak || 0) + 1 : 1;
                    const newLongestStreak = Math.max(newCurrentStreak, profile.longestStreak || 0);
                    const newPerfectDay = (profile.perfectDays || 0) + 1;

                    await dexie.profile.update(profile.id, {
                        currentStreak: newCurrentStreak,
                        longestStreak: newLongestStreak,
                        lastStreakUpdate: today,
                        perfectDays: newPerfectDay,
                    });
                }
            }
        }

        if (newCompletedCount === task.frequency) await getTaskBadge(taskId, updatedStreak);
    });
}

export async function getTaskBadge(taskId: number, currentStreak: number) {
    const labels: TaskAchievementLabel[] = ["Bronze", "Silver", "Gold"];
    const earned: TaskAchievementLabel[] = [];

    for (const label of labels) {
        const milestone = TaskMilestones[label];

        if (currentStreak >= milestone) {
            const existing = await dexie.taskAchievement.where("[taskId+label]").equals([taskId, label]).first();

            if (!existing) {
                await dexie.taskAchievement.add({ taskId, label, date: new Date() });
                earned.push(label);
            }
        }
    }

    return earned;
}

export async function updateProfile(data: { name: string; age: number }) {
    try {
        const profile = await dexie.profile.toCollection().first();

        if (!profile || !profile.id) throw new Error("Profile not found");

        await dexie.profile.update(profile.id, { name: data.name, age: data.age });

        return { success: true };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error };
    }
}
