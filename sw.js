const CACHE_NAME = 'spaced-revision-cache-v1';
// List of all files that make up the app shell.
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/constants.ts',
  '/hooks/useLocalStorage.ts',
  '/hooks/achievementsData.ts',
  '/utils/date.ts',
  '/services/gemini.ts',
  '/components/Header.tsx',
  '/components/AddItemForm.tsx',
  '/components/RevisionList.tsx',
  '/components/RevisionItemCard.tsx',
  '/components/Icons.tsx',
  '/components/SuggestTopicsModal.tsx',
  '/components/DashboardModal.tsx',
  '/components/SessionModal.tsx',
  '/components/SessionConfigModal.tsx',
  '/components/AchievementToast.tsx',
  '/components/Inbox.tsx',
  '/components/PrerequisiteEditorModal.tsx',
  // External assets
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    // Use a cache-first strategy.
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // If we have a cached response, return it.
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Otherwise, fetch from the network.
            return fetch(event.request).then(networkResponse => {
                // If we get a valid response, cache it for future use.
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(error => {
                // Handle fetch errors (e.g., user is offline and resource not in cache)
                console.error('Fetch failed:', error);
            });
        })
    );
});
