/**
 * Service Worker para Centro Médico
 * Permite funcionamiento offline y carga rápida
 */

const CACHE_NAME = 'centro-medico-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Archivos que se guardan en cache para funcionar offline
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS crítico
  '/css/bootstrap.min.css',
  '/css/templatemo-medic-care.css',
  '/css/dark-mode-complete.css',
  
  // JavaScript esencial
  '/js/jquery.min.js',
  '/js/bootstrap.bundle.min.js',
  '/js/custom.js',
  '/js/dark-mode.js',
  '/js/language-manager.js',
  '/js/translations.js',
  
  // Imágenes críticas (hero)
  '/images/slider/doctor-s-hand-holding-stethoscope-closeup.jpg',
  '/images/slider/portrait-successful-mid-adult-doctor-with-crossed-arms.jpg',
  
  // Iconos PWA
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  
  // Página offline
  OFFLINE_URL
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Guardando archivos en cache...');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalado correctamente');
        // Activar inmediatamente
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Error en instalación:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activado correctamente');
        // Tomar control inmediatamente
        return self.clients.claim();
      })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Estrategia: Cache First (para recursos estáticos)
  if (isStaticResource(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((response) => {
              // Guardar en cache si la respuesta es válida
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            });
        })
        .catch(() => {
          // Si no hay internet y no está en cache, mostrar página offline
          if (event.request.destination === 'document') {
            return caches.match(OFFLINE_URL);
          }
        })
    );
  }
  // Estrategia: Network First (para contenido dinámico)
  else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Guardar en cache si es exitoso
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar desde cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Si es una página y no está en cache, mostrar offline
              if (event.request.destination === 'document') {
                return caches.match(OFFLINE_URL);
              }
            });
        })
    );
  }
});

// Determinar si es un recurso estático
function isStaticResource(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.includes(ext));
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificar cuando hay una nueva versión disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
});
