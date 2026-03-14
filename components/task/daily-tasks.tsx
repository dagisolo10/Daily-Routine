import { useLiveQuery } from "dexie-react-hooks";
import { dexie } from "@/lib/db";
import {TaskCard} from "./task-card";
import { AnimatePresence } from "framer-motion";

export default function DailyTasks() {
    const tasks = useLiveQuery(() => dexie.task.toArray()) || [];

    return (
        <div className="space-y-2">
            <div className="font-poppins flex items-center justify-between font-medium">
                <span className="text-lg">Daily Routines</span>
                <span className="text-sm">See All</span>
            </div>

            <div className="space-y-4 pr-2 pb-32">
                {tasks.length === 0 ? (
                    <div>Empty</div>
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
