// Service Worker for DakarBus PWA
const CACHE_NAME = "dakarbus-v2"
const RUNTIME_CACHE = "dakarbus-runtime-v2"
const MAP_CACHE = "dakarbus-map-tiles-v1"
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE && key !== MAP_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: network-first for API, cache-first for static
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip Firebase requests
  if (url.hostname.includes("firebase") || url.hostname.includes("google")) {
    return
  }

  // Network-first for navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/"))
    )
    return
  }

  // Cache-first for static assets (tiles, icons, etc.)
  if (
    event.request.url.includes("cartocdn") ||
    event.request.url.includes("openstreetmap")
  ) {
    event.respondWith(
      caches.open(MAP_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached

          return fetch(event.request)
            .then((response) => {
              // Only cache valid responses
              if (response && response.status === 200) {
                cache.put(event.request, response.clone())
              }
              return response
            })
            .catch(() => {
              // Offline fallback: transparent tile could be returned here
            })
        })
      )
    )
    return
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})

// Push notifications (Firebase Cloud Messaging)
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title || "DakarBus", {
      body: data.body || "Nouvelle alerte sur votre ligne !",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: data.url || "/",
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data || "/"))
})
