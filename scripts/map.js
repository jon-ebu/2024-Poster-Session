import { geojsonFeature } from './polygons.js';

// Initialize map with HMC coordinates
var map = L.map('map', {
    center: [34.1061046, -117.7119814],
    zoom: 19, // Default zoom level
    maxZoom: 21,
    minZoom: 18,
    zoomDelta: 1,
    zoomSnap: 1,
    editable: true // Enable Leaflet.Editable
});

// Define the geographical bounds
var bounds = [
    [34.1054531, -117.7130985], // Southwest corner
    [34.1068478, -117.7111942]  // Northeast corner
];

map.setMaxBounds(bounds);

/** 
// Tile layer using OpenStreetMap (default Leaflet map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 18,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);*/

// Tile layer using OpenStreetMap (default Leaflet map)
L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    minZoom: 18,
    maxZoom: 21,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add polygons to the map
L.geoJSON(geojsonFeature, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
        layer.on('click', function () {
            layer.enableEdit(); // Enable editing on click
        });
    }
}).addTo(map);

// Listen for editable events to get polygon data
map.on('editable:editing', function (event) {
    console.log('Editing started:', event.layer.toGeoJSON());
});

map.on('editable:edited', function (event) {
    console.log('Editing finished:', event.layer.toGeoJSON());
});


export { map };