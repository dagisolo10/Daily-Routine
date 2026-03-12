const CACHE_NAME = "v1.0.0";
const APP_SHELL = ["/"];

// install
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))));

// activate
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))));

// message
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// fetch
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            const clone = response.clone();

            return fetch(event.request)
                .then((response) => {
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));

                    return response;
                })
                .catch(() => caches.match("/"));
        }),
    );
});

// push notification
self.addEventListener("push", (event) => {
    if (!(self.Notification && self.Notification.permission === "granted")) return console.log("Notification permission not granted");

    const data = event.data?.json() ?? {};
    const title = data.title || "New Notification";
    const options = {
        body: data.body || "You have a new notification",
        icon: data.icon || "/new/apple-touch-icon.png",
        data: { url: data.url || "http://localhost:3000" },
    };

    event.waitUntil(self.registration.showNotification(title, options).catch((error) => console.log("Error showing notification: ", error)));
});

self.addEventListener("notificationclick", (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();

    const urlToOpen = event.notification.data.url;
    event.waitUntil(clients.openWindow(urlToOpen));
});
