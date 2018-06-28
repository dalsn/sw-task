'use strict';

var cacheName = 'currencyConverter-v1';

var filesToCache = ['./', './index.html', './js/app.js', './css/style.css', 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css'];

self.addEventListener('install', function (e) {
	console.log('[ServiceWorker] Installed');
	e.waitUntil(caches.open(cacheName).then(function (cache) {
		return cache.addAll(filesToCache);
	}));
});

self.addEventListener('activate', function (e) {
	e.waitUntil(caches.keys().then(function (cacheNames) {
		return Promise.all(cacheNames.map(function (thisCacheName) {
			if (thisCacheName !== cacheName) {
				return caches.delete(thisCacheName);
			}
		}));
	}));
});

self.addEventListener('fetch', function (e) {
	var requestUrl = new URL(e.request.url);
	if (requestUrl.protocol.startsWith('http')) {
		e.respondWith(caches.open(cacheName).then(function (cache) {
			return cache.match(e.request).then(function (response) {
				if (response) {
					return response;
				}

				return fetch(e.request).then(function (networkResponse) {
					cache.put(e.request, networkResponse.clone());
					return networkResponse;
				});
			});
		}));
	}
});

self.addEventListener('message', function (e) {
	if (e.data.action === 'skipWaiting') {
		self.skipWaiting();
		window.reload();
	}
});