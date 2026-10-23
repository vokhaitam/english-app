/* WordFlow Service Worker — cache-first for static assets, network-first for navigation */
const CACHE_NAME = 'wordflow-v3';
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache API calls (user data must be fresh), even cross-origin
  if (url.pathname.startsWith('/api')) return;

  // Cross-origin (fonts, TTS): cache-first with network fallback
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Navigations: network-first, fall back to cached shell when offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put('/index.html', copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────

// Nhận push event từ server (hoặc từ app client qua postMessage)
self.addEventListener('push', (event) => {
  let data = { title: '📚 WordFlow', body: 'Đến giờ học rồi! Học một chút nhé 🎯', icon: '/icons/icon-192.png', badge: '/icons/icon-192.png' };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch {}
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: 'wordflow-study-reminder',
      renotify: true,
      data: { url: data.url || '/' },
      actions: [
        { action: 'study', title: '▶ Học ngay!' },
        { action: 'later', title: '⏰ Nhắc sau' },
      ],
    })
  );
});

// Khi click vào notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  if (event.action === 'later') {
    // Snooze 30 phút — schedule lại bằng alarm API nếu có, không thì bỏ qua
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// Lắng nghe message từ app (để app trigger notification ngay mà không cần server)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;
    self.registration.showNotification(title || '📚 WordFlow', {
      body: body || 'Đến giờ học rồi! Học một chút nhé 🎯',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'wordflow-study-reminder',
      renotify: true,
      data: { url: url || '/' },
      actions: [
        { action: 'study', title: '▶ Học ngay!' },
        { action: 'later', title: '⏰ Nhắc sau' },
      ],
    });
  }
});