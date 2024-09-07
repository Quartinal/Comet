importScripts("/ultraviolet/uv.bundle.js");
importScripts("/ultraviolet/uv.config.js");
importScripts(__uv$config.sw || "/ultraviolet/uv.sw.js");
importScripts("/scramjet/scramjet.codecs.js");
importScripts("/scramjet/scramjet.config.js");
importScripts("/scramjet/scramjet.bundle.js");
importScripts("/scramjet/scramjet.worker.js");
importScripts("/meteor/meteor.codecs.js");
importScripts("/meteor/meteor.config.js");
importScripts("/meteor/meteor.bundle.js");
importScripts("/meteor/meteor.worker.js");

const uv = new UVServiceWorker(), 
    scramjet = new ScramjetServiceWorker(),
    meteor = new MeteorServiceWorker();

self.addEventListener("fetch", async event => {
    event.respondWith(
        (async () => {
            if (event.request.url.startsWith(origin + __uv$config.prefix)) {
                return await uv.fetch(event);
            } else if (scramjet.route(event)) {
                return await scramjet.fetch(event);
            } else if (meteor.shouldRoute(event)) {
                return await meteor.handleFetch(event);
            }

            return await fetch(event.request);
        })()
    );
});