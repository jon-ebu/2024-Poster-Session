// Initialize map with HMC coordinates
var map = L.map('map', {
    center: [34.1061046, -117.7119814],
    zoom: 21, // Default zoom level
    maxZoom: 22, 
    minZoom: 20, 
    zoomDelta: 0.5,
    zoomSnap: 0.5 
})

// Define the geographical bounds
var bounds = [
    [34.1059611, -117.7128357], // Southwest corner
    [34.1066190, -117.7109420]  // Northeast corner
];

map.setMaxBounds(bounds);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    zoom: 21,
    maxZoom: 22,
    minZoom: 21,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

export { map };