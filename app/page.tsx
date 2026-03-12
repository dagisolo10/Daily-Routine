"use client";
import DailyTasks from "@/components/task/daily-tasks";
import StatsGrid from "@/components/stats-grid";
import ThemeSwitcher from "@/components/theme-switch";
import WeekDisplay from "@/components/week-display";
import Image from "next/image";
import OnboardingGuard from "@/components/onboarding-guard";
import Navbar from "@/components/common/navbar";
import { useLiveQuery } from "dexie-react-hooks";
import { dexie } from "@/lib/db";
import { taskStats } from "@/lib/task-stats";
import StatsContextProvider from "@/components/task/stats-context";

export default function Home() {
    const name = useLiveQuery(() => dexie.profile.toCollection().first())?.name || "John";

    taskStats();

    return (
        <OnboardingGuard>
            <StatsContextProvider>
                <div className="space-y-4">
                    <header className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="font-poppins text-2xl font-bold">Hello👋, {name}</h1>
                            <p className="text-muted-foreground text-sm">
                                {new Date().toLocaleString("en-US", { day: "numeric", month: "long", weekday: "long", year: "numeric" })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeSwitcher isDark toggle={() => console.log("")} />
                            <Image
                                src="/toji 3.jpg"
                                alt="Profile Picture"
                                loading="eager"
                                className="size-12 rounded-full object-contain"
                                width={1080}
                                height={1080}
                            />
                        </div>
                    </header>

                    <WeekDisplay />

                    <StatsGrid />

                    <DailyTasks />
                </div>
                <Navbar />
            </StatsContextProvider>
        </OnboardingGuard>
    );
}
