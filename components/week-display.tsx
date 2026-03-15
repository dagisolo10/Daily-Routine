import { cn } from "@/lib/utils";
import { addDays, format, startOfDay } from "date-fns";
import { motion } from "framer-motion";

export default function WeekDisplay() {
    const today = startOfDay(new Date());
    const relativeDays = [-2, -1, 0, 1, 2].map((offset) => ({ date: addDays(today, offset), isToday: offset === 0 }));

    return (
        <div className="flex items-center justify-between">
            {relativeDays.map((item, index) => {
                const { date, isToday } = item;

                return (
                    <div key={index} className="flex flex-col items-center gap-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "relative flex flex-col items-center gap-3 rounded-[24px] p-3 transition-all duration-500",
                                isToday ? "z-10 scale-110 bg-linear-to-b from-blue-500 to-indigo-800 text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)]" : "bg-card text-muted-foreground border border-white/10 backdrop-blur-md",
                            )}
                        >
                            <p className={cn("text-[11px] font-bold tracking-[0.15em] uppercase opacity-80", isToday ? "text-blue-100" : "text-muted-foreground/60")}>{format(date, "EEE")}</p>
                            <div className={cn("flex size-10 items-center justify-center rounded-xl font-bold transition-all", isToday ? "bg-white/20 text-white backdrop-blur-sm" : "bg-secondary/50 text-foreground")}>
                                <span className="text-sm">{format(date, "dd")}</span>
                            </div>
                            {isToday && <motion.div layoutId="active-dot" className="absolute -bottom-1 size-1.5 animate-pulse rounded-full bg-white shadow-[0_0_12px_white]" />}
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
}
