"use client";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DeleteTask, MarkTaskAsCompleted } from "@/lib/actions";
import { dexie, Task } from "@/lib/db";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useStats } from "./stats-context";
import DeleteTaskDialog from "./delete-dialog";
import { useLiveQuery } from "dexie-react-hooks";
import { startOfDay } from "date-fns";
import { FlameIcon } from "../ui/flame";

export function TaskCard({ task }: { task: Task }) {
    const { refreshStats, refreshProfile } = useStats();

    const todayLogs =
        useLiveQuery(() =>
            dexie.taskLog
                .where("[taskId+date]")
                .equals([task.id!, startOfDay(new Date())])
                .toArray(),
        ) || [];

    const frequency = task.frequency || 1;
    const logCount = todayLogs.length;
    const progress = Math.min((logCount / frequency) * 100, 100);
    const isMarked = logCount >= frequency;

    const handleComplete = async () => {
        if (isMarked) return;

        if (logCount + 1 === frequency) {
            confetti({ particleCount: 150, spread: 60, origin: { y: 0.7 }, colors: ["#60a5fa", "#a855f7", "#ec4899"] });
            toast.success("Goal Reached!", { description: `${task.name} finished for today.` });
        } else toast.info(`Progress saved (${logCount + 1}/${frequency})`);

        await MarkTaskAsCompleted(task.id!);
        await refreshStats();
        await refreshProfile();
    };

    const handleDelete = async () => {
        await DeleteTask(task.id!);
        await refreshStats();
        await refreshProfile();

        toast.error("Task Deleted", { description: "Stats recalculated." });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className={cn("relative mb-4 overflow-hidden rounded-xl p-6 transition-all duration-500", "bg-card/40 border border-white/10 shadow-2xl backdrop-blur-xl", isMarked ? "border-blue-500/30 shadow-blue-500/10" : "shadow-black/5")}
        >
            <AnimatePresence>{isMarked && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/5 to-transparent" />}</AnimatePresence>

            <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/40 text-[9px] font-black tracking-[0.2em] uppercase">{isMarked ? "Completed" : "Daily Ritual"}</span>
                        {task.streak >= 1 && (
                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5">
                                <FlameIcon size={12} className="fill-orange-500 text-orange-500" />
                                <span className="text-[10px] font-bold text-orange-500">{task.streak}</span>
                            </motion.div>
                        )}
                    </div>

                    <h3 className={cn("truncate text-xl font-semibold tracking-tight transition-all duration-500", isMarked ? "text-muted-foreground line-through opacity-40" : "text-foreground")}>{task.name}</h3>

                    {!isMarked && frequency > 1 && (
                        <p className="text-muted-foreground/60 text-[11px] font-medium">
                            Session {logCount} of {frequency}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <DeleteTaskDialog onClick={handleDelete} name={task.name} />

                    <button
                        type="button"
                        onClick={handleComplete}
                        className={cn(
                            "relative flex size-14 items-center justify-center rounded-2xl transition-all duration-500 active:scale-80",
                            isMarked ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/40" : "bg-secondary/80 hover:bg-secondary text-muted-foreground border border-white/5",
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {isMarked ? (
                                <motion.div key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 8 }}>
                                    <CheckCheckIcon size={24} />
                                </motion.div>
                            ) : (
                                <motion.div key="plus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                    {frequency > 1 && logCount > 0 ? (
                                        <span className="text-xs font-bold">
                                            {logCount}/{frequency}
                                        </span>
                                    ) : (
                                        <CheckIcon size={24} />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-zinc-500/10 dark:bg-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("h-full transition-colors duration-500", isMarked ? "bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" : "bg-blue-500/50")}
                />
            </div>
        </motion.div>
    );
}
