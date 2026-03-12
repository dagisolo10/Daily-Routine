"use client";
import { Home, Settings, Target, User2 } from "lucide-react";
import TaskModal from "../task/task-modal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    const pathname = "/settings";

    const navigation = [{ label: "Home", icon: Home, path: "/" }, { label: "Goal", icon: Target, path: "/goals" }, { type: "fab" }, { label: "Profile", icon: User2, path: "/profile" }, { label: "Settings", icon: Settings, path: "/settings" }];

    return (
        <div className="fixed bottom-6 left-1/2 z-100 w-[92%] max-w-md -translate-x-1/2">
            <div className="flex items-center justify-around rounded-[2.5rem] border border-white/20 bg-white/70 p-2 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-black/70">
                {navigation.map((nav) => {
                    if (nav.type === "fab") {
                        return (
                            <div key="fab-container" className="relative -top-2">
                                <TaskModal />
                            </div>
                        );
                    }

                    const Icon = nav.icon!;
                    const active = pathname === nav.path;

                    return (
                        <Link href={nav.path!} key={nav.path} className="relative flex flex-col items-center justify-center px-3 py-2 transition-all active:scale-90">
                            {active && <motion.div layoutId="nav-glow" className="absolute inset-0 z-0 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20" transition={{ type: "spring", bounce: 0.3, duration: 0.6 }} />}

                            <Icon size={22} className={cn("relative z-10 transition-colors duration-300", active ? "text-blue-500" : "text-zinc-400")} strokeWidth={active ? 2.5 : 2} />

                            <span className={cn("relative z-10 mt-1 text-xs font-bold tracking-tight transition-colors duration-300", active ? "text-blue-500" : "text-zinc-500")}>{nav.label}</span>

                            {active && (
                                <div className="absolute top-1 right-1">
                                    <span className="flex size-1.5">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative size-1.5 rounded-full bg-blue-500" />
                                    </span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
