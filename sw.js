const CACHE_NAME = 'japan-coupon-v1';
// 在這裡列出所有需要離線使用的資源
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'BIC.jpg',
  'MATS.jpg',
  'SUGI.jpg',
  'COCO.jpg',
  'KINTETSU.jpg',
  'FASOLA.jpg',
  'icon.png'
];

// 安裝並快取資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在快取資源...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 攔截請求，優先從快取讀取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果快取中有，直接回傳；否則發起網路請求
      return response || fetch(event.request);
    })
  );
});

// 啟動時清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('正在清除舊快取...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});