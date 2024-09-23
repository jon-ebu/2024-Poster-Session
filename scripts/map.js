// Initialize map with HMC coordinates
var map = L.map('map', {
    center: [34.1061046, -117.7119814],
    zoom: 20, // Default zoom level
    maxZoom: 22, 
    minZoom: 18, 
    zoomDelta: 0.5,
    zoomSnap: 0.5 
})

// Define the geographical bounds
var bounds = [
    [34.1059611, -117.7128357], // Southwest corner
    [34.1066190, -117.7109420]  // Northeast corner
];

map.setMaxBounds(bounds);

// Tile layer using OpenStreetMap (default Leaflet map)
L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    minZoom: 0,
    maxZoom: 22,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

export { map };