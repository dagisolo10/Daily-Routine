import Dexie, { EntityTable } from "dexie";

export const TaskMilestones = {
    Bronze: 30,
    Silver: 45,
    Gold: 60,
} as const;

export const ProfileMilestones = {
    14: "First Spark",
    30: "Dedicated",
    90: "Persistent",
    180: "Iron Will",
    365: "Immortal",
} as const;

export type ProfileMilestoneDays = keyof typeof ProfileMilestones;
export type ProfileMilestoneLabel = (typeof ProfileMilestones)[ProfileMilestoneDays];
export type TaskAchievementLabel = "Gold" | "Silver" | "Bronze";

export interface Task {
    id?: number;
    name: string;
    frequency: number;
    streak: number;
    createdAt: Date;
}

export interface TaskLog {
    id?: number;
    taskId: number;
    date: Date;
}

export interface Profile {
    id?: number;
    name: string;
    age?: number;
    currentStreak?: number;
    longestStreak?: number;
    perfectDays?: number;
    createdAt: Date;
    lastStreakUpdate?: Date;
}

export interface TaskAchievement {
    id?: number;
    taskId: number;
    label: TaskAchievementLabel;
    date: Date;
}

export const dexie = new Dexie("TaskDatabase") as Dexie & {
    task: EntityTable<Task, "id">;
    taskLog: EntityTable<TaskLog, "id">;
    profile: EntityTable<Profile, "id">;
    taskAchievement: EntityTable<TaskAchievement, "id">;
};

dexie.version(2).stores({
    task: "++id, name, streak, frequency, createdAt",
    taskLog: "++id, taskId, date, [taskId+date]",
    profile: "++id, currentStreak, longestStreak, lastStreakUpdate, perfectDays, createdAt",
    taskAchievement: "++id, taskId, label, [taskId+date], [taskId+label]",
});
