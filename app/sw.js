/* Offline support: keeps the app and its voice clips on the tablet.
   Bump VERSION whenever you change files so tablets pick up the new version. */
var VERSION = 'harfi-v2';
var SHELL = ['./', 'index.html', 'style.css', 'content.js', 'game.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/baloo-bhaijaan-2-arabic-400-normal.woff2', 'fonts/baloo-bhaijaan-2-arabic-600-normal.woff2', 'fonts/baloo-bhaijaan-2-arabic-800-normal.woff2',
  'fonts/baloo-bhaijaan-2-latin-400-normal.woff2', 'fonts/baloo-bhaijaan-2-latin-600-normal.woff2', 'fonts/baloo-bhaijaan-2-latin-800-normal.woff2',
  'audio/index.json'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){
    return c.addAll(SHELL.map(function(u){ return new Request(u, {cache: 'reload'}); })).then(function(){
      return fetch('audio/index.json', {cache: 'reload'}).then(function(r){ return r.ok ? r.json() : {}; }).then(function(idx){
        var files = {}; Object.keys(idx).forEach(function(k){ files['audio/' + idx[k]] = 1; });
        return c.addAll(Object.keys(files));
      }).catch(function(){});
    });
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
/* The app's own code and the clip list: network first (so a new version shows straight away), cache when offline.
   Everything else (fonts, pictures, voice clips): cache first. */
var FRESH = /(\/|index\.html|\.js|\.css|\.webmanifest|audio\/index\.json)$/;
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url), same = url.origin === location.origin;
  function save(res){ if (res.ok && same) { var copy = res.clone(); caches.open(VERSION).then(function(c){ c.put(e.request, copy); }); } return res; }
  if (same && (e.request.mode === 'navigate' || FRESH.test(url.pathname))) {
    e.respondWith(fetch(e.request, {cache: 'no-cache'}).then(save).catch(function(){ return caches.match(e.request, {ignoreSearch: true}); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(hit){ return hit || fetch(e.request).then(save); }));
});
