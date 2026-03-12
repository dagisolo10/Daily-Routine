"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { dexie } from "@/lib/db";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitEvent } from "react";
import { toast } from "sonner";

export default function IntroPage() {
    const finishSetup = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = String(formData.get("name")).trim();
        const age = Number(formData.get("age"));

        if (!name) return toast.error("Hi there 👋!", {
            description: "Please enter your name",
        });

        await dexie.profile.add({ name, age, createdAt: new Date() });
    };

    return (
        <div className="flex h-dvh w-full flex-col px-8 pt-12 dark:bg-[#050505]">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-12">
                <div className="mb-6 grid size-16 place-items-center rounded-3xl bg-linear-to-tr from-blue-500 to-purple-600 shadow-xl shadow-blue-500/20">
                    <Sparkles className="text-white" size={32} />
                </div>
                <h1 className="text-4xl leading-tight font-black tracking-tight">
                    Let&apos;s Build <br />
                    <span className="text-blue-500">Your Routine.</span>
                </h1>
                <p className="mt-4 font-medium text-zinc-500">Customize your experience.</p>
            </motion.div>

            <form onSubmit={finishSetup} className="space-y-4">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Label className="ml-2 text-xs font-black tracking-widest text-zinc-400 uppercase">What&apos;s your name?</Label>
                    <Input name="name" className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-100 p-5 ring-blue-500/50 transition-all outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900" placeholder="Name" />
                </motion.div>

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Label className="ml-2 text-xs font-black tracking-widest text-zinc-400 uppercase">How old are you?</Label>
                    <Input name="age" type="number" className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-100 p-5 ring-blue-500/50 transition-all outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900" placeholder="Age" />
                </motion.div>

                <motion.button whileTap={{ scale: 0.95 }} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-black p-5 font-bold text-white shadow-2xl dark:bg-white dark:text-black">
                    Get Started <ArrowRight size={20} />
                </motion.button>
            </form>
        </div>
    );
}
