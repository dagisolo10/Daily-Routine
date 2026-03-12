"use client";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { MarkTaskAsCompleted, DeleteTask } from "@/lib/actions";
import { dexie, Task } from "@/lib/db";
import { CheckCheckIcon } from "../ui/check-check";
import { FlameIcon } from "../ui/flame";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { startOfDay } from "date-fns";
import { CheckIcon } from "../ui/check";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useStats } from "./stats-context";

export default function TaskCard({ task }: { task: Task }) {
    const weeklyProgress = Math.min(task.streak / 7, 1);
    const today = startOfDay(new Date());
    const isMarked = useLiveQuery(() => dexie.taskLog.where("[taskId+date]").equals([task.id!, today]).first());

    const { refreshStats } = useStats();

    const handleComplete = async () => {
        confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 }, colors: ["#3b82f6", "#8b5cf6", "#d946ef"] });
        toast.success("Task Completed 🎉", { description: `${task.name} is completed for the day. Nice!` });
        await MarkTaskAsCompleted(task.id!);
        await refreshStats();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(isMarked ? "bg-blue-500/10" : "", "relative mb-4 flex items-center justify-between overflow-hidden rounded-3xl border p-5")}
        >
            <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-500">Daily Task</span>
                <h3 className="text-2xl font-bold">{task.name}</h3>

                <Badge className="mt-2 flex items-center gap-2 rounded-full border-dashed bg-orange-500/10 px-3 py-1">
                    <FlameIcon size={20} className="fill-orange-500 text-orange-500" />
                    <span className="text-sm font-bold text-orange-500">{task.streak} Day Streak</span>
                </Badge>
            </div>

            <div className="flex items-center gap-3">
                <DeleteTaskDialog
                    onClick={async () => {
                        DeleteTask(task.id!);
                        refreshStats();
                    }}
                />

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleComplete}
                    className={cn(
                        isMarked ? "from-blue-500 to-purple-600 text-white" : "",
                        "flex size-10 items-center justify-center rounded-2xl border bg-linear-to-br shadow-lg shadow-blue-500/40",
                    )}
                >
                    {isMarked ? <CheckCheckIcon size={24} /> : <CheckIcon size={24} />}
                </motion.button>
            </div>
            <motion.div
                className={cn("absolute bottom-0 left-0 h-1 rounded-full", weeklyProgress === 1 ? "bg-emerald-500" : "bg-amber-500")}
                initial={{ width: "0%" }}
                animate={{ width: `${weeklyProgress * 100}%`, transition: { duration: 0.6, ease: "easeOut" } }}
            />
        </motion.div>
    );
}

export function DeleteTaskDialog({ onClick }: { onClick: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost">
                    <Trash2Icon className="text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this chat conversation. View <a href="#">Settings</a> delete any memories saved during this chat.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClick} variant="destructive">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
