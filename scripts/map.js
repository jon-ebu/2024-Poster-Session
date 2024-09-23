// Initialize map with HMC coordinates
var map = L.map('map', {
    center: [34.1061046, -117.7119814],
    zoom: 21, // Default zoom level
    maxZoom: 22, // Maximum zoom level
    minZoom: 20,  // Minimum zoom level
    zoomDelta: 0.5, // Zoom level increment per scroll event
    zoomSnap: 0.5 // Ensure zoom levels snap to integers
})

// Define the geographical bounds
var bounds = [
    [34.1059611, -117.7128357], // Southwest corner
    [34.1066190, -117.7109420]  // Northeast corner
];

map.setMaxBounds(bounds);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    zoom: 21,
    maxZoom: 22, // Ensure the tile layer supports the specified max zoom level
    minZoom: 21, // Ensure the tile layer supports the specified min zoom level
}).addTo(map);

export { map };