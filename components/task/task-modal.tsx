"use client";
import { SyntheticEvent, useState } from "react";
import { Field } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AddTask } from "@/lib/actions";
import { Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useStats } from "./stats-context";

export default function TaskModal() {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { refreshStats } = useStats();

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = String(formData.get("name")).trim();

        if (!name) return toast.error("Enter a task name");

        toast.promise(AddTask(name), {
            loading: "Adding Task...",
            success: () => {
                setOpen(false);
                refreshStats();
                return { message: "Task created 🎉", description: `${name} is added to your daily routine` };
            },
            error: "Something went wrong",
            finally: () => setLoading(false),
        });
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: "0px 20px 30px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.9, rotate: 90 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="group relative grid size-16 place-items-center overflow-hidden rounded-[24px] border-t border-white/30 bg-linear-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/50"
                >
                    <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <motion.div initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ type: "spring", damping: 12 }}>
                        <Plus className="size-8 drop-shadow-md" strokeWidth={3} />
                    </motion.div>

                    <motion.div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-active:opacity-100" />
                </motion.button>
            </DrawerTrigger>

            <DrawerContent className="z-100" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="text-blue-500" size={18} />
                            <DrawerTitle>Add New Task</DrawerTitle>
                        </div>
                        <DrawerDescription>Create a new daily habit to stay consistent.</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 px-6 pt-2">
                        <Field>
                            <Label htmlFor="name">Task Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Workout, Read, Study" />
                        </Field>

                        <DrawerFooter>
                            <Button disabled={loading}>{loading ? "Creating..." : "Create Task"}</Button>

                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
