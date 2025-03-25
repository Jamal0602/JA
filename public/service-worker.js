// Service Worker for offline functionality
const CACHE_NAME = "jamal-asraf-website-v1"
const OFFLINE_PAGE = "/offline.html"

// Assets to cache
const ASSETS_TO_CACHE = ["/", "/offline.html", "/placeholder.svg", "/styles/globals.css", "/app/globals.css"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Handle API requests separately
  if (event.request.url.includes("/api/")) {
    // Network-first strategy for API requests
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      }),
    )
    return
  }

  // Cache-first strategy for other requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If the request is for a page, return the offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_PAGE)
          }
        })
    }),
  )
})

// Sync event for background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Function to sync data
async function syncData() {
  try {
    const clients = await self.clients.matchAll()
    if (clients && clients.length) {
      // Send message to client to sync data
      clients[0].postMessage({
        type: "SYNC_DATA",
      })
    }
    return true
  } catch (error) {
    console.error("Error syncing data:", error)
    return false
  }
}

