import { cn } from "@/lib/utils";
import { addDays, format, startOfWeek } from "date-fns";
import { Separator } from "./ui/separator";

export default function WeekDisplay() {
    // EE (Sun), EEEE (Sunday), EEEEEE (Su)
    const firstDOW = startOfWeek(new Date());
    const weekdayArray: { day: string; date: number }[] = Array.from(Array(7)).map((_, index) => ({ day: format(addDays(firstDOW, index), "EE"), date: firstDOW.getDate() + index }));

    return (
        <div className="flex items-center justify-around">
            {weekdayArray.map((weekday, index) => {
                const today = new Date().getDate();
                const isToday = today === weekday.date;

                if (today - weekday.date > 2 || weekday.date - today > 2) return;

                return (
                    <div key={index} className={cn(isToday ? "text-background border-none bg-linear-to-b from-blue-800 to-blue-400 shadow-blue-500/60" : "", "flex flex-col items-center gap-2 rounded-4xl border p-2.5 shadow-lg")}>
                        <p className={cn(isToday ? "font-medium" : "text-muted-foreground/70", "uppercase")}>{weekday.day}</p>
                        <Separator />
                        <div className={cn(isToday ? "text-foreground bg-background" : "text-muted-foreground", "grid size-9 place-items-center rounded-full font-medium shadow-md")}>
                            <span className="text-sm">{weekday.date.toString().padStart(2, "0")}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
