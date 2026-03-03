const CACHE_NAME = 'japan-coupon-v2'; // 更新版本號以強制刷新快取
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'BIC.jpg',
  'MATS.jpg',
  'SUGI.jpg',
  'COCO.jpg',
  'SATU.jpg',
  'SUN.jpg',
  'TSU.jpg',
  'EDION.jpg',
  'KINTETSU.jpg',
  'SEIBU.jpg',
  'ODAKYU.jpg',
  'DAIMARU.jpg',
  'FASOLA.jpg',
  'ANA_NRT.jpg',
  'ANA_HND.jpg',
  'icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在安裝新版本快取...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // 強制讓新的 Service Worker 立即接管，不要等待
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('清理舊版本快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // 讓新 Service Worker 立即控制所有頁面
  return self.clients.claim();
});