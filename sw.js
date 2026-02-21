/**
 * MoonLight Restaurant - Service Worker
 * Provides offline functionality and asset caching for better performance
 */

const CACHE_NAME = 'moonlight-v1.2';
const STATIC_CACHE = 'moonlight-static-v1.2';
const DYNAMIC_CACHE = 'moonlight-dynamic-v1.2';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/menu2.html',
    '/assets/css/critical.css',
    '/assets/css/non-critical.css',
    '/assets/css/menu-optimized.css',
    '/assets/js/config.js',
    '/assets/js/performance.js',
    '/assets/images/hero-restaurant.jpg',
    // Add other critical assets
];

// Assets to cache on first access
const DYNAMIC_ASSETS = [
    '/menu.html',
    '/qr-code.html',
    '/assets/images/food/',
    // CDN resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
            return self.clients.claim(); // Take control immediately
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip external requests (except fonts and CDNs)
    if (!url.origin.includes(location.origin) && 
        !url.origin.includes('fonts.googleapis.com') && 
        !url.origin.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(request).then(cachedResponse => {
            // Return cached version if available
            if (cachedResponse) {
                // Update cache in background for dynamic assets
                if (isDynamicAsset(request.url)) {
                    event.waitUntil(updateCache(request));
                }
                return cachedResponse;
            }
            
            // Fetch from network and cache
            return fetch(request).then(networkResponse => {
                // Only cache successful responses
                if (networkResponse.status !== 200) {
                    return networkResponse;
                }
                
                // Cache the response
                const responseToCache = networkResponse.clone();
                caches.open(getCacheForRequest(request)).then(cache => {
                    cache.put(request, responseToCache);
                });
                
                return networkResponse;
            }).catch(error => {
                console.log('Fetch failed:', error);
                
                // Return offline fallback for navigation requests
                if (request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                
                // Return cached version for other requests
                return caches.match(request);
            });
        })
    );
});

/**
 * Update cache in background
 */
function updateCache(request) {
    return fetch(request).then(response => {
        if (response.status === 200) {
            return caches.open(getCacheForRequest(request)).then(cache => {
                return cache.put(request, response);
            });
        }
    }).catch(error => {
        console.log('Background update failed:', error);
    });
}

/**
 * Determine if asset should be dynamically cached
 */
function isDynamicAsset(url) {
    return url.includes('/assets/images/') || 
           url.includes('.jpg') || 
           url.includes('.png') || 
           url.includes('.webp') ||
           url.includes('fonts.googleapis.com') ||
           url.includes('cdnjs.cloudflare.com');
}

/**
 * Get appropriate cache for request
 */
function getCacheForRequest(request) {
    if (isDynamicAsset(request.url)) {
        return DYNAMIC_CACHE;
    }
    return STATIC_CACHE;
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        // Handle offline form submissions here if needed
    }
});

// Push notifications (for future restaurant updates)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'New update from MoonLight Restaurant',
            icon: '/assets/images/icon-192.png',
            badge: '/assets/images/badge-72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey || 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Menu',
                    icon: '/assets/images/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/assets/images/xmark.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'MoonLight Restaurant', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open menu page
        event.waitUntil(
            clients.openWindow('/menu2.html')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default click - open main page
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync (for menu updates)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'menu-sync') {
        event.waitUntil(syncMenuData());
    }
});

/**
 * Sync menu data in background
 */
function syncMenuData() {
    return fetch('/api/menu-updates')
        .then(response => response.json())
        .then(data => {
            // Update cached menu data if changed
            if (data.lastModified > getLastMenuUpdate()) {
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    return cache.add('/menu2.html');
                });
            }
        })
        .catch(error => {
            console.log('Menu sync failed:', error);
        });
}

/**
 * Get last menu update timestamp
 */
function getLastMenuUpdate() {
    // Implementation would check IndexedDB or localStorage
    return localStorage.getItem('lastMenuUpdate') || 0;
}

// Handle cache storage quota
self.addEventListener('quotaexceeded', event => {
    console.log('Cache quota exceeded, cleaning up...');
    
    event.waitUntil(
        caches.open(DYNAMIC_CACHE).then(cache => {
            return cache.keys().then(requests => {
                // Delete oldest cached images if quota exceeded
                const imageRequests = requests.filter(req => 
                    req.url.includes('/assets/images/'));
                
                if (imageRequests.length > 20) {
                    const toDelete = imageRequests.slice(0, 10);
                    return Promise.all(
                        toDelete.map(req => cache.delete(req))
                    );
                }
            });
        })
    );
});

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        // Log performance metrics sent from main thread
        console.log('Performance metrics:', event.data.metrics);
    }
});

console.log('MoonLight Restaurant Service Worker loaded');