"use client";
import ThemeSwitcher from "@/components/theme-switch";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dexie } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Edit, MoonIcon, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useStats } from "@/components/task/stats-context";
import ResetStreakDialog from "@/components/task/reset-streak-dialog";
import WipeDataDialog from "@/components/task/wipe-data-dialog";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
    const { refreshProfile, refreshStats } = useStats();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const profile = useLiveQuery(() => dexie.profile.toCollection().first());

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (!profile) return null;

    const displayImage = profile.avatar ? URL.createObjectURL(profile.avatar) : "/toji 3.jpg";

    const triggerVibration = (pattern: number | number[]) => {
        if (typeof window !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) return toast.error("Image too large. Please keep it under 2MB.");

        try {
            await dexie.profile.update(profile.id, { avatar: file });

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            toast.success("Profile picture updated!");
        } catch (error) {
            toast.error(`Failed to save image: ${error}`);
        }
    };

    const handleUpdate = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        triggerVibration(10);
        const formData = new FormData(e.currentTarget);

        const name = formData.get("name")?.toString().trim();
        const age = Number(formData.get("age"));

        if (!name) return toast.error("You are somebody so what's your name?");
        if (age <= 0) return toast.error("You cannot not exist huh? Enter valid age");

        try {
            await dexie.profile.update(profile.id, { name, age });

            refreshProfile();
            toast.success("Profile details updated!");
        } catch (error) {
            console.error("Update failed:", error);
            toast.error(`Failed to update profile: ${error}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const resetStreak = async () => {
        await dexie.profile.update(profile.id, { currentStreak: 0, longestStreak: 0, perfectDays: 0 });
        triggerVibration([50, 100, 50]);
        refreshStats();
        refreshProfile();
        toast.success("Streaks purged");
    };

    const wipeData = async () => {
        triggerVibration([100, 50, 100]);
        const tables = [dexie.task, dexie.taskLog, dexie.taskAchievement];
        await Promise.all(tables.map((t) => t.clear()));
        refreshStats();
        refreshProfile();
        toast.success("Full system wipe complete");
    };

    return (
        <div className="pb- pb space-y-6 px-4 py-4">
            <h1 className="text-muted-foreground/60 text-center text-sm font-black tracking-[0.3em] uppercase">System Configuration</h1>

            <section className="bg-card/30 relative overflow-hidden rounded-[32px] border border-white/10 p-6 backdrop-blur-xl">
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-blue-500/15 blur-3xl" />

                <div className="mb-8 flex items-center gap-6">
                    <Label htmlFor="avatar-upload" className="group relative cursor-pointer">
                        <div className="size-20 overflow-hidden rounded-2xl border-2 border-white/10 p-0.75 transition-colors group-hover:border-blue-500/50">
                            <Image src={previewUrl || displayImage} alt="profile" width={200} height={200} className="size-full rounded-xl object-cover" />
                        </div>

                        <div className="absolute -right-2 -bottom-2 grid size-8 place-items-center rounded-md bg-slate-600 text-white shadow-lg shadow-blue-600/20 transition-transform group-active:scale-90">
                            <Edit size={14} />
                            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                    </Label>
                    <div>
                        <h2 className="text-xl font-black uppercase italic">{profile.name}</h2>
                        <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">Subject ID: {profile.id || 101}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="flex flex-col items-end gap-4">
                    <Field className="gap-2">
                        <Label className="text-muted-foreground/40 ml-1 text-[10px] font-black tracking-widest uppercase">Username</Label>
                        <Input name="name" className="h-12 rounded-2xl border-white/5 bg-white/5 px-4 font-bold transition-all focus:border-blue-500/50 focus:bg-white/10" defaultValue={profile.name} />
                    </Field>

                    <Field className="gap-2">
                        <Label className="text-muted-foreground/40 ml-1 text-[10px] font-black tracking-widest uppercase">Age</Label>
                        <Input name="age" type="number" className="h-12 rounded-2xl border-white/5 bg-white/5 px-4 font-bold transition-all focus:border-blue-500/50 focus:bg-white/10" defaultValue={profile.age} />
                    </Field>

                    <Button disabled={isUpdating}>
                        {isUpdating ? <RefreshCw className="mr-2 size-4 animate-spin" /> : null}
                        {isUpdating ? "Syncing..." : "Sync Profile"}
                    </Button>
                </form>
            </section>

            <section className="space-y-3">
                <h3 className="text-muted-foreground/40 ml-2 text-[10px] font-black tracking-widest uppercase">Preferences</h3>
                <div className="bg-card/30 rounded-[24px] border border-white/10 p-2 backdrop-blur-xl">
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                        <div className="flex items-center gap-4">
                            <div className="grid size-10 place-items-center rounded-xl bg-blue-500/20 text-blue-400">
                                <MoonIcon size={20} />
                            </div>
                            <span className="text-sm font-bold tracking-tight">Dark Mode</span>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-destructive ml-2 text-[10px] font-black tracking-widest uppercase">Danger Zone</h3>
                <div className="border-destructive/40 bg-destructive/20 overflow-hidden rounded-[24px] border backdrop-blur-xl">
                    <ResetStreakDialog onClick={resetStreak} />
                    <Separator className="bg-destructive" />
                    <WipeDataDialog onClick={wipeData} />
                </div>
            </section>
        </div>
    );
}
