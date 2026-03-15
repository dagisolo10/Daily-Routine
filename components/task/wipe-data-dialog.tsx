import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronRight, Trash2, Trash2Icon } from "lucide-react";

export default function WipeDataDialog({ onClick }: { onClick: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5 active:bg-white/10" type="button">
                    <div className="flex items-center gap-4">
                        <div className="grid size-10 place-items-center rounded-xl bg-current/10 text-red-400">
                            <Trash2 size={18} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Wipe All Data</span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/30" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Wipe Data?</AlertDialogTitle>
                    <AlertDialogDescription>This will reset wipe everything. This action cannot be undone.</AlertDialogDescription>
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
