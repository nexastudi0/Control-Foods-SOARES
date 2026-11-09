const CACHE = 'marmitas-static-v4-3-fornecedor';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./config.js','./favicon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./nexa-marmitas-logo.webp','./splash-nexa-marmitas.webp'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok && url.pathname.endsWith('config.js')===false){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}
  return response;
 }).catch(()=>caches.match(event.request)));
});
