import { useLiveQuery } from "dexie-react-hooks";
import { dexie } from "@/lib/db";
import { TaskCard } from "./task-card";
import { AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function DailyTasks() {
    const tasks = useLiveQuery(() => dexie.task.toArray()) || [];

    return (
        <div className="space-y-2">
            <div className="font-poppins flex items-center justify-between font-medium">
                <span className="text-lg font-bold tracking-wide">Daily Routines</span>
            </div>

            <div className="space-y-4 pr-2 pb-32">
                {tasks.length === 0 ? (
                    <div className="flex h-48 w-full items-center justify-center rounded-2xl border-2 border-dashed">
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-3xl font-semibold">No tasks added yet</p>
                            <p className="text-muted-foreground font-medium">Add your first task</p>
                            <ArrowDown className="animate-bounce stroke-3 text-blue-500" />
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <div key={task.id}>
                                <TaskCard task={task} />
                            </div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
