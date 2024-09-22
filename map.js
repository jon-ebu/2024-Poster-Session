// Initialize map with HMC coordinates
var map = L.map('map', {
    center: [34.106109928727946, -117.7120061219193],
    zoom: 21, // Default zoom level
    maxZoom: 22, // Maximum zoom level
    minZoom: 20,  // Minimum zoom level
    zoomDelta: 0.5, // Zoom level increment per scroll event
    zoomSnap: 0.5 // Ensure zoom levels snap to integers
})

// Define the geographical bounds
var bounds = [
    [34.1055463, -117.7123690], // Southwest corner
    [34.1066190, -117.7109420]  // Northeast corner
];

map.setMaxBounds(bounds);

// Tile layer using Google Satellite view
L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    zoom: 21,
    maxZoom: 22, // Ensure the tile layer supports the specified max zoom level
    minZoom: 21, // Ensure the tile layer supports the specified min zoom level
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);

export { map };