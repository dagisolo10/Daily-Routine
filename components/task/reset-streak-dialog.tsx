import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronRight, RefreshCw, Trash2Icon } from "lucide-react";

export default function ResetStreakDialog({ onClick }: { onClick: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5 active:bg-white/10" type="button">
                    <div className="flex items-center gap-4">
                        <div className="grid size-10 place-items-center rounded-xl bg-current/10 text-orange-400">
                            <RefreshCw size={18} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Reset Streaks</span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/30" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Reset Streak?</AlertDialogTitle>
                    <AlertDialogDescription>This will reset your current and longest streak and perfect days to zero. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClick} variant="destructive">
                        Reset
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
