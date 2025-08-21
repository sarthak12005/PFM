// Service Worker for SaveWise PWA
const CACHE_NAME = 'savewise-v1.0.0'
const STATIC_CACHE = 'savewise-static-v1.0.0'
const DYNAMIC_CACHE = 'savewise-dynamic-v1.0.0'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/transactions/,
  /\/api\/budget/,
  /\/api\/categories/,
  /\/api\/user\/profile/
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error)
      })
  )
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // Take control of all pages
        return self.clients.claim()
      })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }
  
  // Handle other requests (static assets)
  event.respondWith(handleStaticRequest(request))
})

// Handle API requests with cache-first strategy for GET requests
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    try {
      return await fetch(request)
    } catch (error) {
      // Return offline message for failed non-GET requests
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'This action requires an internet connection' 
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
  
  // Check if this API endpoint should be cached
  const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))
  
  if (!shouldCache) {
    return fetch(request)
  }
  
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline message
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No cached data available' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Network failed, serve cached index.html
    const cachedResponse = await caches.match('/')
    return cachedResponse || new Response('Offline', { status: 503 })
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  // Try cache first for static assets
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return offline fallback
    return new Response('Offline', { status: 503 })
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'background-sync-transactions') {
    event.waitUntil(syncOfflineTransactions())
  }
})

// Sync offline transactions when connection is restored
async function syncOfflineTransactions() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions()
    
    for (const transaction of offlineTransactions) {
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction.data)
        })
        
        // Remove from offline storage after successful sync
        await removeOfflineTransaction(transaction.id)
      } catch (error) {
        console.error('Failed to sync transaction:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflineTransactions() {
  // Implementation would use IndexedDB to store offline transactions
  return []
}

async function removeOfflineTransaction(id) {
  // Implementation would remove transaction from IndexedDB
  console.log('Removing offline transaction:', id)
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from SaveWise',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open SaveWise',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('SaveWise', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
