"use client";
import { useStats } from "@/components/task/stats-context";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Zap, Target, Shield, Crown, InfinityIcon, Trophy, Flame, LucideProps, Info } from "lucide-react";
import Image from "next/image";
import { ForwardRefExoticComponent, MouseEventHandler, RefAttributes, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MILESTONE_MAP = {
    "First Spark": { icon: Zap, description: "The habit has taken root." },
    Dedicated: { icon: Target, description: "One month of pure discipline." },
    Persistent: { icon: Shield, description: "Forged in the heat of routine." },
    "Iron Will": { icon: Crown, description: "Nothing can break your cycle." },
    Immortal: { icon: InfinityIcon, description: "A legendary year of growth." },
};

export default function Profile() {
    const { profile } = useStats();

    if (!profile) return null;
    const displayImage = profile.avatar ? URL.createObjectURL(profile.avatar) : "/toji 3.jpg";

    return (
        <div className="space-y-8 px-4">
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/30 relative overflow-hidden rounded-[32px] border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute -top-10 -right-10 size-40 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="flex flex-col items-center gap-5 text-center">
                    <div className="relative">
                        <div className="grid size-28 place-items-center overflow-hidden rounded-full bg-linear-to-tr from-blue-500 via-indigo-600 to-purple-700 p-1 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                            <div className="grid size-26 place-items-center overflow-hidden">
                                <Image src={displayImage} alt="Profile Picture" loading="eager" className="size-full rounded-full" width={1080} height={1080} />
                            </div>
                        </div>

                        <motion.div className="ring-background absolute -right-1 -bottom-1 flex items-center gap-0.5 rounded-full bg-orange-500 px-3 py-1 text-white shadow-lg ring-2" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Flame size={14} className="fill-white" />
                            <span className="text-xs font-black">{profile?.currentStreak}</span>
                        </motion.div>
                    </div>

                    <div className="w-full space-y-1">
                        <h1 className="text-3xl font-black tracking-tight uppercase italic">{profile?.name}</h1>

                        <div className="text-muted-foreground/40 flex items-center justify-between border-t border-white/5 pt-4 text-[11px] font-black tracking-widest uppercase">
                            <span>Age: {profile?.age || "N/A"}</span>
                            <span>Joined {format(new Date(profile.joinedAt), "MMM yyyy")}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <HeroStat label="Longest Streak" value={profile.longestStreak.toString()} color="text-blue-400" />
                    <HeroStat label="Perfect Days" value={profile?.perfectDays.toString()} color="text-emerald-400" />
                </div>
            </motion.header>

            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-muted-foreground/50 text-sm font-black tracking-[0.2em] uppercase">Ascension Path</h2>
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Profile Milestones</span>
                </div>

                <div className="space-y-4">
                    {profile?.milestones.map(([days, label], index) => (
                        <MileStones key={days} isUnlocked={(profile.longestStreak || 0) >= Number(days)} icon={MILESTONE_MAP[label].icon} label={label} description={MILESTONE_MAP[label].description} days={Number(days)} index={index} />
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-muted-foreground px-2 text-xs font-black tracking-[0.2em] uppercase">Task Mastery</h2>

                <div className="bg-card/20 flex h-full flex-col justify-between rounded-3xl border p-5 backdrop-blur-md">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black">{profile?.totalCount || 0}</span>
                            <p className="text-muted-foreground/60 mt-4 text-[10px] font-bold uppercase">Total Badges Earned</p>
                        </div>

                        <Trophy className="text-yellow-500/50" size={20} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <BadgeMini image="🥇" count={profile?.count.Gold || 0} color="from-orange-500/20 to-orange-500/5 text-orange-500" />
                        <BadgeMini image="🥈" count={profile?.count.Silver || 0} color="from-slate-500/20 to-slate-500/5 text-slate-500" />
                        <BadgeMini image="🥉" count={profile?.count.Bronze || 0} color="from-yellow-500/20 to-yellow-500/5 text-yellow-500" />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-muted-foreground/60 px-2 text-xs font-black tracking-[0.2em] uppercase">Insights</h2>

                <div className="space-y-4 rounded-3xl border bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-5 backdrop-blur-md">
                    <InsightRow label="Best Habit" value={profile?.dominantTask || "None"} tooltip={profile.otherHabits.length > 0} others={profile.otherHabits} tieCount={profile.tieCount} />
                    <InsightRow label="Avg Completion" value={`${profile?.completionRate || 0}%`} />
                    <InsightRow label="Next Milestone" value={profile?.nextAchievement?.label || "First Spark"} />

                    {profile.nextAchievement && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-500/10 p-3">
                            <Info size={14} className="text-blue-400" />
                            <p className="text-[10px] font-bold tracking-wider text-blue-400/80 uppercase">Next Milestone in {profile.nextAchievement.daysRemaining} Days</p>
                        </div>
                    )}
                </div>
            </section>

            <footer className="pt-4 text-center">
                <p className="text-muted-foreground/40 text-[10px] font-bold tracking-[0.3em] uppercase">Member since {format(new Date(profile.joinedAt), "MMM yyyy")}</p>
            </footer>
        </div>
    );
}

function HeroStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="rounded-2xl bg-white/5 p-4 text-center transition-colors hover:bg-white/10">
            <p className="text-muted-foreground/50 mb-1 text-[10px] font-black tracking-widest uppercase">{label}</p>
            <p className={cn("text-xl font-black", color)}>{value}</p>
        </div>
    );
}

interface MilestoneProp {
    isUnlocked: boolean;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
    days: number;
    description: string;
    index: number;
}

function MileStones({ isUnlocked, icon: Icon, label, days, description, index }: MilestoneProp) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn("group relative flex items-center gap-4 overflow-hidden rounded-[24px] border p-4 transition-all duration-500", isUnlocked ? "border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/5" : "bg-card/20 text-foreground/40 grayscale")}
        >
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all", isUnlocked ? "border-blue-400/30 bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-muted-foreground border-white/10 bg-white/5")}>
                <Icon className="size-6" />
            </div>

            <div className="flex flex-1 items-center justify-between">
                <div>
                    <h3 className="font-bold tracking-tight">{label}</h3>
                    <p className={cn(isUnlocked ? "text-muted-foreground" : "text-muted-foreground/40", "line-clamp-1 text-xs")}>{description}</p>
                </div>

                <span className="text-[10px] font-black opacity-40">{days} DAYS</span>
            </div>

            {isUnlocked && (
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 rotate-12 text-blue-500/10 transition-transform group-hover:scale-110">
                    <Trophy className="size-24" />
                </div>
            )}
        </motion.div>
    );
}

function BadgeMini({ count, color, image }: { count: number; color: string; image: string }) {
    return (
        <div className={cn("flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-linear-to-b p-3 transition-transform hover:scale-105", color)}>
            <span className="text-sm font-black italic">{count}</span>
            <span className="text-3xl drop-shadow-md">{image}</span>
        </div>
    );
}

function InsightRow({ label, value, tooltip, others, tieCount }: { label: string; value: string; tooltip?: boolean; others?: string; tieCount?: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const OnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
            <span className="text-muted-foreground/80 text-[11px] font-medium">{label}</span>
            <div className="flex items-center gap-2">
                {tooltip && (
                    <TooltipProvider delayDuration={0}>
                        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
                            <TooltipTrigger asChild onClick={OnClick} className="text-blue-400/60">
                                <Info className="size-4" />
                            </TooltipTrigger>

                            <TooltipContent side="top" avoidCollisions={true} className="bg-popover/90 border-white/10 p-4 backdrop-blur-xl">
                                <p className="text-muted-foreground text-sm font-medium tracking-tight">
                                    Tied with {tieCount}: <span className="text-blue-400">{others}</span>
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                <span className="text-accent-foreground/70 text-xs font-black tracking-wider uppercase">{value}</span>
            </div>
        </motion.div>
    );
}
