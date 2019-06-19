// ########################################################################################

// fonte: https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js
// Other example pre-cached... if I want to put just the updated data, just comment the others and refresh

var CACHE_VERSION = 2;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

const OFFLINE_URL = '/';

self.addEventListener('install', function(event) {
  var now = Date.now();

  var urlsToPrefetch = [
    '/',
    "/static/manifest.json",
    "/static/sw.js",
    "/static/jac_district_pt.json",
    "/static/jac_district_pol.json",
    "/static/sjc_sjc_district_pt.json",
    "/static/sjc_sjc_district_pol.json",
    "/static/stabranca_district_pt.json",
    "/static/stabranca_district_pol.json",
    "/static/css/images/layers-2x.png",
    "/static/css/images/layers.png",
    "/static/css/images/marker-icon-2x.png",
    "/static/css/images/marker-icon.png",
    "/static/css/images/marker-shadow.png",
    "/static/css/images/baseline_cached_black_36dp.png",
    "/static/css/images/baseline_close_black_48dp.png",
    "/static/css/images/baseline_code_black_24dp.png",
    "/static/css/images/baseline_data_usage_black_36dp.png",
    "/static/css/images/baseline_menu_black_48dp.png",
    "/static/css/images/baseline_my_location_36dp.png",
    "/static/css/images/baseline_navigation_36dp.png",
    "/static/css/images/baseline_replay_30_black_36dp.png",
    "/static/css/images/img_difference_DEM_DSM_small.png",
    "/static/css/images/img_difference_DEM_DSM.png",
    "/static/css/images/img_difference_DTM_DSM.png",
    "/static/css/images/perfil_ibge.gif",
    "/static/css/leaflet.css",
    "/static/css/easy-button.css",
    "/static/css/main.css",
    "/static/js/jquery-3.3.1.min.js",
    "/static/js/leaflet.ajax.js",
    "/static/js/leaflet.js",
    "/static/js/main.js",
    "/static/js/plotly-latest.min.js",
    "/static/js/react-dom.development.js",
    "/static/js/react.development.js",
    "/static/js/turf.min.js",
    "/static/image/icons/icon-72x72.png",
    "/static/image/icons/icon-96x96.png",
    "/static/image/icons/icon-128x128.png",
    "/static/image/icons/icon-144x144.png",
    "/static/image/icons/icon-152x152.png",
    "/static/image/icons/icon-192x192.png",
    "/static/image/icons/icon-384x384.png",
    "/static/image/icons/icon-512x512.png",
    "https://a.tile.openstreetmap.org/0/0/0.png",
    "https://a.tile.openstreetmap.org/1/0/0.png",
    "https://a.tile.openstreetmap.org/1/0/1.png",
    "https://a.tile.openstreetmap.org/1/1/0.png",
    "https://a.tile.openstreetmap.org/1/1/1.png",
    "https://a.tile.openstreetmap.org/2/0/0.png",
    "https://a.tile.openstreetmap.org/2/0/1.png",
    "https://a.tile.openstreetmap.org/2/0/2.png",
    "https://a.tile.openstreetmap.org/2/0/3.png",
    "https://a.tile.openstreetmap.org/2/1/0.png",
    "https://a.tile.openstreetmap.org/2/1/1.png",
    "https://a.tile.openstreetmap.org/2/1/2.png",
    "https://a.tile.openstreetmap.org/2/1/3.png",
    "https://a.tile.openstreetmap.org/2/2/0.png",
    "https://a.tile.openstreetmap.org/2/2/1.png",
    "https://a.tile.openstreetmap.org/2/2/2.png",
    "https://a.tile.openstreetmap.org/2/2/3.png",
    "https://a.tile.openstreetmap.org/2/3/0.png",
    "https://a.tile.openstreetmap.org/2/3/1.png",
    "https://a.tile.openstreetmap.org/2/3/2.png",
    "https://a.tile.openstreetmap.org/2/3/3.png",
    "https://a.tile.openstreetmap.org/3/0/0.png",
    "https://a.tile.openstreetmap.org/3/0/1.png",
    "https://a.tile.openstreetmap.org/3/0/2.png",
    "https://a.tile.openstreetmap.org/3/0/3.png",
    "https://a.tile.openstreetmap.org/3/0/4.png",
    "https://a.tile.openstreetmap.org/3/0/5.png",
    "https://a.tile.openstreetmap.org/3/0/6.png",
    "https://a.tile.openstreetmap.org/3/0/7.png",
    "https://a.tile.openstreetmap.org/3/1/0.png",
    "https://a.tile.openstreetmap.org/3/1/1.png",
    "https://a.tile.openstreetmap.org/3/1/2.png",
    "https://a.tile.openstreetmap.org/3/1/3.png",
    "https://a.tile.openstreetmap.org/3/1/4.png",
    "https://a.tile.openstreetmap.org/3/1/5.png",
    "https://a.tile.openstreetmap.org/3/1/6.png",
    "https://a.tile.openstreetmap.org/3/1/7.png",
    "https://a.tile.openstreetmap.org/3/2/0.png",
    "https://a.tile.openstreetmap.org/3/2/1.png",
    "https://a.tile.openstreetmap.org/3/2/2.png",
    "https://a.tile.openstreetmap.org/3/2/3.png",
    "https://a.tile.openstreetmap.org/3/2/4.png",
    "https://a.tile.openstreetmap.org/3/2/5.png",
    "https://a.tile.openstreetmap.org/3/2/6.png",
    "https://a.tile.openstreetmap.org/3/2/7.png",
    "https://a.tile.openstreetmap.org/3/3/0.png",
    "https://a.tile.openstreetmap.org/3/3/1.png",
    "https://a.tile.openstreetmap.org/3/3/2.png",
    "https://a.tile.openstreetmap.org/3/3/3.png",
    "https://a.tile.openstreetmap.org/3/3/4.png",
    "https://a.tile.openstreetmap.org/3/3/5.png",
    "https://a.tile.openstreetmap.org/3/3/6.png",
    "https://a.tile.openstreetmap.org/3/3/7.png",
    "https://a.tile.openstreetmap.org/3/4/0.png",
    "https://a.tile.openstreetmap.org/3/4/1.png",
    "https://a.tile.openstreetmap.org/3/4/2.png",
    "https://a.tile.openstreetmap.org/3/4/3.png",
    "https://a.tile.openstreetmap.org/3/4/4.png",
    "https://a.tile.openstreetmap.org/3/4/5.png",
    "https://a.tile.openstreetmap.org/3/4/6.png",
    "https://a.tile.openstreetmap.org/3/4/7.png",
    "https://a.tile.openstreetmap.org/3/5/0.png",
    "https://a.tile.openstreetmap.org/3/5/1.png",
    "https://a.tile.openstreetmap.org/3/5/2.png",
    "https://a.tile.openstreetmap.org/3/5/3.png",
    "https://a.tile.openstreetmap.org/3/5/4.png",
    "https://a.tile.openstreetmap.org/3/5/5.png",
    "https://a.tile.openstreetmap.org/3/5/6.png",
    "https://a.tile.openstreetmap.org/3/5/7.png",
    "https://a.tile.openstreetmap.org/3/6/0.png",
    "https://a.tile.openstreetmap.org/3/6/1.png",
    "https://a.tile.openstreetmap.org/3/6/2.png",
    "https://a.tile.openstreetmap.org/3/6/3.png",
    "https://a.tile.openstreetmap.org/3/6/4.png",
    "https://a.tile.openstreetmap.org/3/6/5.png",
    "https://a.tile.openstreetmap.org/3/6/6.png",
    "https://a.tile.openstreetmap.org/3/6/7.png",
    "https://a.tile.openstreetmap.org/3/7/0.png",
    "https://a.tile.openstreetmap.org/3/7/1.png",
    "https://a.tile.openstreetmap.org/3/7/2.png",
    "https://a.tile.openstreetmap.org/3/7/3.png",
    "https://a.tile.openstreetmap.org/3/7/4.png",
    "https://a.tile.openstreetmap.org/3/7/5.png",
    "https://a.tile.openstreetmap.org/3/7/6.png",
    "https://a.tile.openstreetmap.org/3/7/7.png"
  ];

  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant SW accessed via chrome://serviceworker-internals
  console.log('Handling install event. Resources to prefetch:', urlsToPrefetch);

  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
      var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
        // This constructs a new URL object using the service worker's script location as the base
        // for relative URLs.
        var url = new URL(urlToPrefetch, location.href);
        // Append a cache-bust=TIMESTAMP URL parameter to each URL's query string.
        // This is particularly important when precaching resources that are later used in the
        // fetch handler as responses directly, without consulting the network (i.e. cache-first).
        // If we were to get back a response from the HTTP browser cache for this precaching request
        // then that stale response would be used indefinitely, or at least until the next time
        // the service worker script changes triggering the install flow.
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

        // It's very important to use {mode: 'no-cors'} if there is any chance that
        // the resources being fetched are served off of a server that doesn't support
        // CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
        // In this example, www.chromium.org doesn't support CORS, and the fetch()
        // would fail if the default mode of 'cors' was used for the fetch() request.
        // The drawback of hardcoding {mode: 'no-cors'} is that the response from all
        // cross-origin hosts will always be opaque
        // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
        // and it is not possible to determine whether an opaque response represents a success or failure
        // (https://github.com/whatwg/fetch/issues/14).
        var request = new Request(url, {mode: 'no-cors'});
        return fetch(request).then(function(response) {
          if (response.status >= 400) {
            throw new Error('request for ' + urlToPrefetch +
              ' failed with status ' + response.statusText);
          }

          // Use the original URL without the cache-busting parameter as the key for cache.put().
          return cache.put(urlToPrefetch, response);
        }).catch(function(error) {
          console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
        });
      });

      return Promise.all(cachePromises).then(function() {
        console.log('Pre-fetching complete.');
      });
    }).catch(function(error) {
      console.error('Pre-fetching failed:', error);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    // caches.match() will look for a cache entry in all of the caches available to the service worker.
    // It's an alternative to first opening a specific named cache and then matching on that.
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }

      console.log('No response found in cache. About to fetch from network...');

      // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
      // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        // This catch() will handle exceptions thrown from the fetch() operation.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('Fetching failed:', error);
        return caches.match(OFFLINE_URL);

        // throw error;
      });
    })
  );
});


// Set the callback for the install step
// https://c.tile.openstreetmap.org/2/1/1.png
// ver https://www.terrestris.de/service-worker/
