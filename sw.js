let cacheName = 'currencyConverter-v1';

let filesToCache = [
	'./',
	'./index.html',
	'./js/app.js',
	'./js/idb.js',
	'./css/style.css',
	'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700',
	'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
	'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css'
];


self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Installed');
    e.waitUntil(    	
	    caches.open(cacheName).then((cache) => {    	
			return cache.addAll(filesToCache);
	    })
	); 
});


self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(cacheNames.map((thisCacheName) => {
				if (thisCacheName !== cacheName) {				
					return caches.delete(thisCacheName);
				}
			}));
		})
	);

});


self.addEventListener('fetch', (e) => {
	let requestUrl = new URL(e.request.url);
	if (requestUrl.protocol.startsWith('http') && !requestUrl.pathname.startsWith('/api/v5/convert')) {
		e.respondWith(
			caches.open(cacheName)
				.then((cache) => {
					return cache.match(e.request).then((response) => {
						if (response) {
							return response;
						}

						return fetch(e.request).then((networkResponse) => {
							cache.put(e.request, networkResponse.clone());
							return networkResponse;
						})
					})
				})
		);
	}
});

self.addEventListener('message', (e) => {
	if (e.data.action === 'skipWaiting') {
		self.skipWaiting();
		let bool = confirm("There is an update available for download");
		if (bool) location.reload();
	}
});
