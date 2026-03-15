"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeSwitcher() {
    const { resolvedTheme, setTheme } = useTheme();
    const THEME_KEY = "y";
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === THEME_KEY && event.key) {
                event.preventDefault();

                setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [resolvedTheme, setTheme]);

    return (
        <div className="relative flex h-10 w-22 cursor-pointer items-center rounded-full border-2 border-slate-700 bg-slate-800 transition-colors duration-500 dark:border-slate-700" onClick={() => setTheme(isDark ? "light" : "dark")}>
            <motion.div className="grid size-9 place-items-center rounded-full bg-slate-100 shadow-lg" animate={{ x: isDark ? 48 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={isDark ? "moon" : "sun"} initial={{ rotate: -180, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 180, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
                        {isDark ? <Moon className="size-5 fill-blue-400/20 text-blue-400" /> : <Sun className="size-5 fill-yellow-500/20 text-yellow-500" />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <div className="pointer-events-none absolute flex w-full justify-between px-3 text-slate-400">
                <Sun size={20} className={cn(isDark ? "block" : "invisible")} />
                <Moon size={20} className={cn(isDark ? "invisible" : "block")} />
            </div>
        </div>
    );

    // return (
    //     <motion.button onClick={() => setTheme(isDark ? "light" : "dark")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group bg-card/40 relative aspect-square size-12 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-xl backdrop-blur-md">
    //         <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

    //         <AnimatePresence mode="wait" initial={false}>
    //             <motion.div className="grid size-full place-items-center" key={resolvedTheme} initial={{ y: 15, opacity: 0, rotate: -135 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -15, opacity: 0, rotate: 135 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
    //                 {isDark ? (
    //                     <div className="relative">
    //                         <Sun size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" fill="currentColor" />
    //                         <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 size-5 rounded-full bg-yellow-400 blur-md" />
    //                     </div>
    //                 ) : (
    //                     <div className="relative">
    //                         <MoonIcon size={20} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
    //                         <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute inset-0 size-5 rounded-full bg-blue-500 blur-lg" />
    //                     </div>
    //                 )}
    //             </motion.div>
    //         </AnimatePresence>
    //     </motion.button>
    // );
}
