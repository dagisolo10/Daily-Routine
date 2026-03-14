"use client";
import DailyTasks from "@/components/task/daily-tasks";
import StatsGrid from "@/components/stats-grid";
import WeekDisplay from "@/components/week-display";
import OnboardingGuard from "@/components/onboarding-guard";
import Header from "@/components/common/header";

export default function Home() {
    return (
        <OnboardingGuard>
            <div className="space-y-4">
                <Header />
                <WeekDisplay />
                <StatsGrid />
                <DailyTasks />
            </div>
        </OnboardingGuard>
    );
}
