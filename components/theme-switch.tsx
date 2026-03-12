"use client";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
    return (
        <motion.button whileTap={{ scale: 0.9, rotate: 15 }} onClick={toggle} className="rounded-full border border-zinc-200 bg-zinc-100 p-3 shadow-inner dark:border-zinc-800 dark:bg-zinc-900">
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-600" />}
        </motion.button>
    );
}
