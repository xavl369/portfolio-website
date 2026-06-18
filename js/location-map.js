(function () {
  "use strict";

  $(document).ready(function () {
    var map = L.map("location-map", {
      center: [29.0729, -110.9559],
      zoom: 5,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
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
  });
}());
