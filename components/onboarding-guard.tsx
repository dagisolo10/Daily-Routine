"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import IntroPage from "./intro-page";
import { dexie } from "@/lib/db";
import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { Button } from "@/components/ui/button";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const profile = useLiveQuery(() => dexie.profile.toArray());

    if (!profile)
        return (
            <div className="grid min-h-dvh place-items-center gap-4">
                <Button variant="outline" disabled size="sm">
                    <Spinner data-icon="inline-start" />
                    Please wait
                </Button>
            </div>
        );

    return (
        <AnimatePresence mode="wait">
            {profile.length === 0 ? (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                    <IntroPage />
                </motion.div>
            ) : (
                <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
