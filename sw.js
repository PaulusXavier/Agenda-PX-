const CACHE_NAME = 'agenda-bv-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
// Instala e guarda os arquivos principais do app em cache.
// Cada arquivo é cacheado individualmente: se um faltar (ex: ícone com
// caminho errado), isso não derruba a instalação do service worker inteiro.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          fetch(url)
            .then((response) => {
              if (response.ok) return cache.put(url, response);
              console.warn('[sw] não consegui cachear (resposta não-ok):', url, response.status);
            })
            .catch((err) => console.warn('[sw] não consegui cachear:', url, err))
        )
      )
    )
  );
  self.skipWaiting();
});
// Remove caches antigos quando uma nova versão é instalada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});
// Estratégia: tenta rede primeiro (para pegar dados/atualizações),
// se falhar (offline) usa o cache do app shell.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Nunca interceptar chamadas ao Firebase/Firestore - elas precisam ir direto à rede
  if (url.hostname.includes('firestore') || url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
