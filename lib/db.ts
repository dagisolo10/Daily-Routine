import Dexie, { EntityTable } from "dexie";

export const AchievementMilestones = {
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

export type AchievementLabel = "Gold" | "Silver" | "Bronze";

export interface Task {
    id?: number;
    name: string;
    createdAt: Date;
    streak: number;
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
    createdAt: Date;
}

export interface Achievement {
    id?: number;
    taskId: number;
    label: AchievementLabel;
    date: Date;
}

export const dexie = new Dexie("TaskDatabase") as Dexie & {
    task: EntityTable<Task, "id">;
    taskLog: EntityTable<TaskLog, "id">;
    profile: EntityTable<Profile, "id">;
    achievement: EntityTable<Achievement, "id">;
};

dexie.version(2).stores({
    task: "++id, name, createdAt",
    taskLog: "++id, taskId, date, [taskId+date]",
    profile: "++id, currentStreak, longestStreak",
    achievement: "++id, taskId, label, [taskId+date], [taskId+label]",
});
