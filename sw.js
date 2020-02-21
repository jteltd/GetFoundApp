const staticCacheName = 'app-static-v1';
const dynamicCacheName = 'app-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/fallback.html',
  '/assets/icon54/style.css',
  '/assets/web//assets/mobirise-icons/mobirise-icons.css',
  '/assets/icons-mind/style.css',
  '/assets/simple-line-icons/simple-line-icons.css',
  '/assets/web//assets/mobirise-icons2/mobirise2.css',
  '/assets/tether/tether.min.css',
  '/assets/bootstrap/css/bootstrap.min.css',
  '/assets/bootstrap/css/bootstrap-grid.min.css',
  '/assets/bootstrap/css/bootstrap-reboot.min.css',
  '/assets/dropdown/css/style.css',
  '/assets/formstyler/jquery.formstyler.css',
  '/assets/formstyler/jquery.formstyler.theme.css',
  '/assets/datepicker/jquery.datetimepicker.min.css',
  '/assets/socicon/css/styles.css',
  '/assets/web//assets/gdpr-plugin/gdpr-styles.css',
  '/assets/animatecss/animate.min.css',
  '/assets/theme/css/style.css',
  '/assets/formoid-css/recaptcha.css',
  '/assets/mobirise/css/mbr-additional.css'    
];

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    }).catch(() => caches.match('/fallback.html'))
  );
});