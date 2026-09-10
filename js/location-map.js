/** Location map — lazily loads Leaflet (CSS + JS + tiles) only when the
	location section approaches the viewport, keeping it out of the
	initial page load. */
(function () {
	"use strict";

	var mapEl = document.getElementById("location-map");
	if (!mapEl) return;

	var loaded = false;

	function initMap() {
		var map = L.map("location-map", {
			center: [29.0729, -110.9559],
			zoom: 5,
			scrollWheelZoom: false,
			zoomControl: true,
		});

		// CARTO's free anonymous basemap tiles now require an API key, so we use
		// Esri's free (no-key) Dark Gray Canvas basemap instead — base layer plus
		// a transparent label reference layer on top, no key required.
		var esriAttribution =
			'&copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors, and the GIS User Community';

		L.tileLayer(
			"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
			{ attribution: esriAttribution, maxZoom: 16 }
		).addTo(map);

		L.tileLayer(
			"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
			{ maxZoom: 16 }
		).addTo(map);

		var icon = L.divIcon({
			className: "location-marker",
			html: '<div class="location-marker-pin"></div><div class="location-marker-pulse"></div>',
			iconSize: [20, 20],
			iconAnchor: [10, 10],
			popupAnchor: [0, -14],
		});

		L.marker([29.0729, -110.9559], { icon: icon })
			.addTo(map)
			.bindPopup(
				"<strong style='color:#58a6ff'>Hermosillo, Sonora</strong><br>México"
			)
			.openPopup();
	}

	function loadLeaflet() {
		if (loaded) return;
		loaded = true;

		var css = document.createElement("link");
		css.rel = "stylesheet";
		css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
		css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
		css.crossOrigin = "";
		// Load the CSS first so the map renders with correct layout on init.
		css.onload = css.onerror = function () {
			var script = document.createElement("script");
			script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
			script.onload = initMap;
			document.body.appendChild(script);
		};
		document.head.appendChild(css);
	}

	if ("IntersectionObserver" in window) {
		var observer = new IntersectionObserver(function (entries) {
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].isIntersecting) {
					observer.disconnect();
					loadLeaflet();
					break;
				}
			}
		}, { rootMargin: "600px 0px" });
		observer.observe(mapEl);
	} else {
		loadLeaflet();
	}
}());
