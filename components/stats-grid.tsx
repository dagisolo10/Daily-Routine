"use client";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";
import { useStats } from "./task/stats-context";

export default function StatsGrid() {
    // const statsDisplay = [
    //     {
    //         title: "Today's Tasks",
    //         value: `${stats.completedToday} / ${stats.totalTasks}`,
    //         subtitle: "Completed today",
    //         color: "bg-blue-500/20 text-blue-600",
    //     },
    //     {
    //         title: "Current Streak",
    //         value: `${stats.currentStreak}-day 🔥`,
    //         subtitle: "Consistency",
    //         color: "bg-orange-500/20 text-orange-600",
    //     },
    //     {
    //         title: "Longest Streak",
    //         value: `${stats.longestStreak}-day 🔥`,
    //         subtitle: "Your best",
    //         color: "bg-emerald-500/20 text-emerald-600",
    //     },
    //     {
    //         title: "Weekly Progress",
    //         value: `${stats.weeklyProgress}%`,
    //         subtitle: "This week",
    //         color: "bg-purple-500/20  text-purple-600",
    //     },
    //     {
    //         title: "Next Achievement",
    //         value: stats.nextAchievement,
    //         subtitle: "Upcoming badge",
    //         color: "bg-yellow-300/20 text-yellow-600",
    //     },
    //     {
    //         title: "Consistency",
    //         value: `${stats.consistency}% consistent`,
    //         subtitle: "Keep going",
    //         color: "bg-pink-300/20 text-pink-600",
    //     },
    // ];

    const { stats } = useStats();
    const statsDisplay = [
        {
            title: "Today's Tasks",
            value: `${stats.completedToday} / ${stats.totalTasks}`,
            subtitle: stats.completedToday === stats.totalTasks ? "Perfect day! 🎉" : "Stay focused",
            color: "bg-blue-500/20 text-blue-600",
        },
        {
            title: "Current Streak",
            value: `${stats.currentStreak}-day 🔥`,
            subtitle: "Days without missing",
            color: "bg-orange-500/20 text-orange-600",
        },
        {
            title: "Longest Streak",
            value: `${stats.longestStreak}-day 🔥`,
            subtitle: "Your personal record",
            color: "bg-emerald-500/20 text-emerald-600",
        },
        {
            title: "Weekly Progress",
            value: `${stats.weeklyProgress}%`,
            subtitle: "Weekly efficiency",
            color: "bg-purple-500/20 text-purple-600",
        },
        {
            title: "Next Achievement",
            value: stats.nextAchievement,
            subtitle: "Best streak ever",
            color: "bg-yellow-300/20 text-yellow-600",
        },
        {
            title: "Consistency",
            value: `${stats.consistency}%`,
            subtitle: "Average daily completion",
            color: "bg-pink-300/20 text-pink-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {statsDisplay.map((stat) => (
                <Card key={stat.title} className={cn("justify-between gap-1 rounded-2xl p-4 shadow-md", stat.color)}>
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
                                            initial={{ width: "0%" }}
                                            animate={{ width: isFilled ? "100%" : "0%" }}
                                            transition={{ duration: 0.6, delay: key * 0.3, ease: "easeOut" }}
                                            className={cn(
                                                "h-full rounded-full bg-linear-to-r",
                                                isFilled ? "from-blue-500 to-purple-500" : "bg-transparent",
                                            )}
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
