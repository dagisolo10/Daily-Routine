"use client";
import { TaskMilestones } from "@/lib/db";
import { motion } from "framer-motion";
import { Trophy, Star, Medal } from "lucide-react";

const badgeConfig = {
    Bronze: { icon: Medal, color: "from-amber-600 to-amber-800", shadow: "shadow-amber-500/20" },
    Silver: { icon: Star, color: "from-slate-300 to-slate-500", shadow: "shadow-slate-400/20" },
    Gold: { icon: Trophy, color: "from-yellow-400 to-orange-500", shadow: "shadow-yellow-500/40" },
};

export default function BadgeGrid({ earnedBadges }: { earnedBadges: string[] }) {
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {(Object.keys(TaskMilestones) as Array<keyof typeof TaskMilestones>).map((label) => {
                const isEarned = earnedBadges.includes(label);
                const Config = badgeConfig[label];

                return (
                    <motion.div
                        key={label}
                        whileHover={isEarned ? { scale: 1.1, rotate: 5 } : {}}
                        className={`relative flex flex-col items-center rounded-3xl border-2 p-4 transition-all ${
                            isEarned ? `bg-linear-to-br ${Config.color} border-transparent ${Config.shadow} shadow-lg` : "border-dashed border-zinc-300 bg-zinc-100 grayscale dark:border-zinc-800 dark:bg-zinc-900"
                        }`}
                    >
                        <Config.icon size={32} className={isEarned ? "text-white" : "text-zinc-400"} />
                        <span className={`mt-2 text-[10px] font-black tracking-widest uppercase ${isEarned ? "text-white" : "text-zinc-500"}`}>{label}</span>
                        {!isEarned && <span className="mt-1 text-[9px] text-zinc-400">{TaskMilestones[label]}d</span>}
                    </motion.div>
                );
            })}
        </div>
    );
}
