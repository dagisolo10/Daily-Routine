"use client";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { dexie } from "@/lib/db";
import BadgeGrid from "@/components/badge-grid";

export default function AchievementsPage() {
    const tasks = useLiveQuery(() => dexie.task.toArray()) || [];
    const achievements = useLiveQuery(() => dexie.achievement.toArray()) || [];

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/" className="glass-card rounded-xl p-2">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-black">Milestones</h1>
            </div>

            {tasks.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">No tasks tracked yet.</div>
            ) : (
                tasks.map((task) => {
                    const taskBadges = achievements.filter((a) => a.taskId === task.id).map((a) => a.label);

                    return (
                        <div key={task.id} className="mb-10">
                            <h3 className="mb-2 px-4 text-sm font-bold tracking-tighter text-zinc-500 uppercase">{task.name}</h3>
                            <BadgeGrid earnedBadges={taskBadges} />
                        </div>
                    );
                })
            )}
        </div>
    );
}
