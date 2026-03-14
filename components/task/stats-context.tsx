"use client";
import { ProfileMilestoneLabel } from "@/lib/db";
import { profileStats } from "@/lib/profile-stats";
import { taskStats } from "@/lib/task-stats";
import { createContext, ReactNode, useContext, useEffect, useState, useMemo } from "react";

type ProfileStatsData = Awaited<ReturnType<typeof profileStats>>;
type StatsData = Awaited<ReturnType<typeof taskStats>>;

interface StatsContextType {
    stats: StatsData;
    profile: ProfileStatsData | null;
    refreshStats: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

export const StatsContext = createContext<StatsContextType | undefined>(undefined);

export default function StatsContextProvider({ children }: { children: ReactNode }) {
    const [stats, setStats] = useState<StatsData>({ totalTasks: 0, completedToday: 0, weeklyProgress: 0, currentStreak: 0, longestStreak: 0, nextAchievement: "First Spark", consistency: 0 });
    const [profile, setProfile] = useState<ProfileStatsData | null>(null);

    const getProfile = async () => setProfile(await profileStats());

    const getStats = async () => {
        const statsData = await taskStats();
        setStats({ ...statsData, nextAchievement: (statsData.nextAchievement as ProfileMilestoneLabel) ?? "First Spark" });
    };

    useEffect(() => {
        const init = async () => await Promise.all([getStats(), getProfile()]);

        init();
    }, []);

    const value = useMemo(() => ({ stats, refreshStats: getStats, profile, refreshProfile: getProfile }), [profile, stats]);

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
    const context = useContext(StatsContext);
    if (!context) throw new Error("useStats must be used within a StatsContextProvider");

    return context;
}
