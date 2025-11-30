self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle incoming push events (from server) or locally triggered ones
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Sickle Sense Check-in';
  const options = {
    body: data.body || 'Time for your safety check-in. How are you feeling?',
    icon: '/icon.png', // Ensure this image exists in public folder
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    tag: 'check-in',
    requireInteraction: true,
    data: {
      url: '/emergency/help?fromNotification=true'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Focus the window if open, or open a new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          // Send a message to the client to open the modal
          client.postMessage({ type: 'OPEN_CHECKIN_MODAL' });
          return client.focus();
        }
      }
      // If no window is open, open one
      if (clients.openWindow) {
        return clients.openWindow('/?fromNotification=true');
      }
    })
  );
});