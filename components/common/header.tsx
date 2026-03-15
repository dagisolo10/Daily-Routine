import Image from "next/image";
import { useLiveQuery } from "dexie-react-hooks";
import { dexie } from "@/lib/db";

export default function Header() {
    const profile = useLiveQuery(() => dexie.profile.toCollection().first());

    if (!profile) return null;

    const time = new Date().getHours();
    const label = time < 12 ? "Good Morning" : time < 18 ? "Good Afternoon" : "Good Evening";
    const displayImage = profile.avatar ? URL.createObjectURL(profile.avatar) : "/toji 3.jpg";

    return (
        <header className="flex items-center justify-between gap-4">
            <div>
                <h1 className="font-poppins text-muted-foreground text-sm font-bold tracking-wide">{label} 👋</h1>
                <h1 className="font-poppins text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground text-sm">{new Date().toLocaleString("en-US", { day: "numeric", month: "long", weekday: "long", year: "numeric" })}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <Image src={displayImage} alt="Profile Picture" loading="eager" className="size-12 rounded-full object-contain" width={1080} height={1080} />
            </div>
        </header>
    );
}
