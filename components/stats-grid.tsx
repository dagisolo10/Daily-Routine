"use client";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";
import { useStats } from "./task/stats-context";

export default function StatsGrid() {
    const { stats } = useStats();
    const statsDisplay = [
        {
            title: "Today's Tasks",
            value: `${stats.completedToday} / ${stats.totalTasks}`,
            subtitle: stats.completedToday === stats.totalTasks ? "Rituals completed! ✨" : `${stats.totalTasks - stats.completedToday} left to conquer`,
            color: "bg-blue-500/20 text-blue-600 shadow-blue-500/10",
        },
        { title: "Current Streak", value: `${stats.currentStreak} 🔥`, subtitle: stats.currentStreak > 0 ? "Don't break the chain! 🔗" : "Start your journey today", color: "bg-red-500/20 text-red-600 shadow-red-500/10" },
        { title: "Longest Streak", value: `${stats.longestStreak} 🔥`, subtitle: "Your best run so far", color: "bg-emerald-500/20 text-emerald-600 shadow-emerald-500/10" },
        { title: "Weekly Flow", value: `${stats.weeklyProgress}%`, subtitle: stats.weeklyProgress > 80 ? "Elite performance 🚀" : "Building consistency", color: "bg-purple-500/20 text-purple-600 shadow-purple-500/10" },
        { title: "Next Milestone", value: stats.nextAchievement, subtitle: "Almost within reach 🏁", color: "bg-yellow-300/20 text-yellow-600 shadow-yellow-500/10" },
        { title: "Discipline Score", value: `${stats.consistency}%`, subtitle: "Lifetime completion rating", color: "bg-pink-300/20 text-pink-600 shadow-pink-500/10" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {statsDisplay.map((stat) => (
                <Card key={stat.title} className={cn("justify-between gap-1 rounded-2xl border-none p-4 shadow-xl backdrop-blur-3xl", stat.color)}>
                    <p className="text-sm font-medium tracking-wider">{stat.title}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                    {stat.title === "Today's Tasks" && (
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: stats.totalTasks }).map((_, key) => {
                                const completedTasks = stats.completedToday;
                                const isFilled = key < completedTasks;

                                return (
                                    <div key={key} className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                        <motion.div
                                            className={cn("h-full rounded-full bg-linear-to-r", isFilled ? "from-blue-500 to-purple-500" : "bg-transparent")}
                                            initial={{ width: "0%" }}
                                            animate={{ width: isFilled ? "100%" : "0%" }}
                                            transition={{ duration: 0.6, delay: key * 0.3, ease: "easeOut" }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {stat.title === "Weekly Progress" && <Progress value={stats.weeklyProgress} className="bg-purple-500/20 [&>div]:bg-purple-500" />}
                    <span className="text-xs">{stat.subtitle}</span>
                </Card>
            ))}
        </div>
    );
}
