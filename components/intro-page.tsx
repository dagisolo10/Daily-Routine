"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Edit, User } from "lucide-react";
import { dexie } from "@/lib/db";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function IntroPage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error("Image too large", { description: "Please keep it under 2MB." });
        }

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const finishSetup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = String(formData.get("name")).trim();
        const age = Number(formData.get("age"));

        if (!name) return toast.error("Hi there 👋!", { description: "Please enter your name" });

        try {
            await dexie.profile.add({
                name,
                age,
                avatar: imageFile || undefined,
                createdAt: new Date(),
                perfectDays: 0,
                currentStreak: 0,
                longestStreak: 0,
            });

            toast.success("Welcome aboard!");
        } catch {
            toast.error("Setup failed");
        }
    };

    return (
        <div className="flex h-dvh w-full flex-col px-8 pt-8 dark:bg-[#050505]">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 flex justify-between">
                <h1 className="text-4xl leading-tight font-black tracking-tight text-white">
                    Let&apos;s Build <br />
                    <span className="text-blue-500">Your Routine.</span>
                </h1>
                <div className="mb-6 grid size-16 place-items-center rounded-3xl bg-linear-to-tr from-blue-500 to-purple-600 shadow-xl shadow-blue-500/20">
                    <Sparkles className="text-white" size={32} />
                </div>
            </motion.div>

            <form onSubmit={finishSetup} className="space-y-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center justify-center py-4">
                    <Label htmlFor="avatar-upload" className="group relative cursor-pointer">
                        <div className="size-24 overflow-hidden rounded-4xl border-2 border-white/10 bg-zinc-900 p-1 transition-all group-hover:border-blue-500/50">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="preview" width={100} height={100} className="size-full rounded-4xl object-cover" />
                            ) : (
                                <div className="grid size-full place-items-center rounded-4xl bg-zinc-800 text-zinc-500">
                                    <User size={32} />
                                </div>
                            )}
                        </div>
                        <div className="absolute -right-2 -bottom-2 grid size-8 place-items-center rounded-md bg-blue-500 text-white shadow-lg transition-transform group-active:scale-90">
                            <Edit size={14} />
                        </div>
                        <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </Label>
                    <span className="mt-3 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Identity Matrix</span>
                </motion.div>

                <div className="space-y-4">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <Label className="ml-2 text-[10px] font-black tracking-widest text-zinc-500 uppercase">What&apos;s your name?</Label>
                        <Input name="name" className="mt-1 h-12 w-full rounded-2xl border-zinc-800 bg-zinc-900 px-5 text-white ring-blue-500/50 transition-all focus:ring-2" placeholder="e.g. Toji" />
                    </motion.div>

                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Label className="ml-2 text-[10px] font-black tracking-widest text-zinc-500 uppercase">How old are you?</Label>
                        <Input name="age" type="number" className="mt-1 h-12 w-full rounded-2xl border-zinc-800 bg-zinc-900 px-5 text-white ring-blue-500/50 transition-all focus:ring-2" placeholder="21" />
                    </motion.div>
                </div>

                <motion.button whileTap={{ scale: 0.98 }} className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white font-bold text-black shadow-xl transition-all hover:bg-zinc-200">
                    Start Journey <ArrowRight size={20} />
                </motion.button>
            </form>
        </div>
    );
}
