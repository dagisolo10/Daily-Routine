"use client";
import { ProfileMilestoneLabel } from "@/lib/db";
import { taskStats } from "@/lib/task-stats";
import { createContext, ReactNode, useContext, useEffect, useState, useMemo } from "react";

interface Stats {
    totalTasks: number;
    completedToday: number;
    weeklyProgress: number;
    currentStreak: number;
    longestStreak: number;
    nextAchievement: ProfileMilestoneLabel;
    consistency: number;
}

interface StatsContextType {
    stats: Stats;
    refreshStats: () => Promise<void>;
}

export const StatsContext = createContext<StatsContextType | undefined>(undefined);

export default function StatsContextProvider({ children }: { children: ReactNode }) {
    const [stats, setStats] = useState<Stats>({
        totalTasks: 0,
        completedToday: 0,
        weeklyProgress: 0,
        currentStreak: 0,
        longestStreak: 0,
        nextAchievement: "First Spark",
        consistency: 0,
    });

    const getStats = async () => {
        const statsData = await taskStats();
        setStats({
            ...statsData,
            nextAchievement: (statsData.nextAchievement as ProfileMilestoneLabel) ?? "First Spark",
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getStats();
    }, []);

    const value = useMemo(
        () => ({
            stats,
            refreshStats: getStats,
        }),
        [stats],
    );

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
    const context = useContext(StatsContext);
    if (!context) throw new Error("useStats must be used within a StatsContextProvider");

    return context;
}
