const CACHE_NAME = "v2/2";
const APP_SHELL = ["/"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_SHELL);
        })(),
    );
});

self.addEventListener("activate", (event) =>
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
        })(),
    ),
);

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET" || event.request.url.includes("/api/")) return;

    event.respondWith(
        (async () => {
            const cached = await caches.match(event.request);

            if (cached) return cached;

            try {
                const response = await fetch(event.request);

                const cache = await caches.open(CACHE_NAME);

                cache.put(event.request, response.clone());

                return response;
            } catch (error) {
                console.log("Fetch error:", error);
                return caches.match("/");
            }
        })(),
    );
});

self.addEventListener("message", (event) => {
    const data = event.data;
    if (!data?.type) return;

    if (data.type === "SKIP_WAITING") self.skipWaiting();

    if (data.type === "SCHEDULE_NOTIFICATION") {
        const { title, body, delay, url = "/" } = data;

        setTimeout(() => {
            self.registration.showNotification(title, {
                body,
                icon: "/new/apple-touch-icon.png",
                requireInteraction: true,
                data: { url },
            });
        }, delay);
    }

    if (data.type === "TASK_COMPLETION") {
        const { title, body, url = "/" } = data;

        self.registration.showNotification(title, {
            body,
            icon: "/new/apple-touch-icon.png",
            requireInteraction: true,
            data: { url },
        });
    }
});

self.addEventListener("notificationclick", (event) => {
    event.waitUntil(
        (async () => {
            const notification = event.notification;
            const url = notification.data.url;

            notification.close();

            const allClients = await clients.matchAll({ type: "window" });

            if (allClients.length > 0) allClients[0].focus();
            else clients.openWindow(url);
        })(),
    );
});
