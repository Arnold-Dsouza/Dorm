// PWA Service Worker for TABU app
// Supports offline functionality and both iOS & Android push notifications

const CACHE_NAME = 'tabu-pwa-v2.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/tabu.png',
  '/icons/icon-128.webp',
  '/icons/icon-192.webp',
  '/icons/icon-512.webp'
  // Add other critical assets here
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('PWA Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA Service Worker caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('PWA Service Worker installed and skipping waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('PWA Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('PWA Service Worker removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('PWA Service Worker activated and claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }
        
        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();
        
        // Make network request and cache the response
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response as it can only be used once
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Return fallback for navigation requests if offline
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('Push event received', event);
  
  // Default notification options
  let title = 'TABU Notification';
  let options = {
    body: 'You have a new notification from TABU',
    icon: '/tabu.png',
    badge: '/icons/icon-96.webp',
    data: { 
      timestamp: Date.now(),
      platform: 'pwa'
    },
    tag: 'tabu-notification', // Group similar notifications
    vibrate: [200, 100, 200], // Vibration pattern for Android
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    renotify: true, // Alert the user with a vibration/sound even if it's a replacement
    silent: false, // Notification should play sound/vibrate
    requireInteraction: true // On Android, notification stays until user interacts
  };
  
  if (event.data) {
    try {
      // Try to parse as JSON
      const data = event.data.json();
      
      title = data.title || title;
      options = {
        ...options,
        body: data.body || options.body,
        icon: data.icon || options.icon,
        badge: data.badge || options.badge,
        data: { 
          ...(data.data || {}), 
          timestamp: Date.now(),
          platform: 'pwa'
        },
        tag: data.tag || options.tag,
        vibrate: data.vibrate || options.vibrate,
        actions: data.actions || options.actions,
        renotify: data.renotify !== undefined ? data.renotify : options.renotify,
        silent: data.silent !== undefined ? data.silent : options.silent,
        requireInteraction: data.requireInteraction !== undefined ? data.requireInteraction : options.requireInteraction
      };
    } catch (error) {
      // If not JSON, use as plain text
      console.error('Error parsing push notification data:', error);
      options.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  
  // Close the notification
  event.notification.close();
  
  // Handle different actions
  if (event.action === 'dismiss') {
    console.log('User dismissed notification');
    return;
  }
  
  // Get the URL to open (if specified in the notification data)
  let urlToOpen = new URL('/', self.location.origin).href;
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      // Check if there is already a window/tab open with the target URL
      for (const client of clientList) {
        if ('focus' in client) {
          console.log('Focusing existing client');
          return client.focus();
        }
      }
      
      // If no window/tab is open, open one
      if (clients.openWindow) {
        console.log('Opening new client window', urlToOpen);
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker skipping waiting on message');
    self.skipWaiting();
  }
  
  // For testing notifications
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    console.log('Showing test notification');
    self.registration.showNotification('TABU Test Notification', {
      body: 'This is a test notification from TABU',
      icon: '/tabu.png',
      badge: '/icons/icon-96.webp',
      vibrate: [200, 100, 200],
      data: { timestamp: Date.now(), test: true }
    });
  }
});
