"use client";
import { useEffect } from "react";

export default function ServiceRegister() {
    useEffect(() => {
        if ("serviceWorker" in window.navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((reg) => console.log("Service worker success...", reg.scope))
                .catch((err) => console.log("Service worker failed", err));
        }

        const handleOnline = () => console.log("Online");
        const handleOffline = () => console.log("Offline");

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return null;
}
