const cacheName = "pirateMW";
const staticAssets = [
	"./",
	"./index.html",
	"./main.css",
	"./manifest.webmanifest",
	"./app.js",
];

self.addEventListener("install", async (e) => {
	const cache = await caches.open(cacheName);
	await cache.addAll(staticAssets);
	return self.skipWaiting(); //asks service worker to move into the activate phase.
});

self.addEventListener("activate", (e) => {
	self.clients.claim(); //cleans out previous version of cache instance.
});

// intercepts any fetch request that goes out from our app.
self.addEventListener("fetch", async (e) => {
	const req = e.request;
	const url = new URL(req.url);
	//If we are fetching something, we first make a request call,if we aren't able to make a request call,
	//then we check in our cache, and return the data if it's present.
	if (url.origin === location.origin) {
		e.respondWith(cacheFirst(req));
	} else {
		e.respondWith(networkAndCache(req));
	}
});

const cacheFirst = async (req) => {
	const cache = await caches.open(cacheName); //opens the cache with our given cacheName.
	const cached = await cache.match(req); // then finds if the thing is present or not.
	return cached || fetch(req); // if it's present it returns the cache thing, else it makes a network call
};

async function networkAndCache(req) {
	const cache = await caches.open(cacheName); //opens the cache with our given cacheName
	try {
		// fetches the data from the given source.
		const fresh = await fetch(req);
		await cache.put(req, fresh.clone()); //caches the fresh data.
		return fresh;
	} catch (e) {
		// if our network call fails, we go to the cache and return the cached data.
		const cached = await cache.match(req);
		return cached;
	}
}