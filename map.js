// Initialize map with HMC coordinates
var map = L.map('map').setView([34.106109928727946, -117.7120061219193], 20);

// Define the geographical bounds
var bounds = [
    [34.1055463, -117.7123690], // Southwest corner
    [34.1066590, -117.7115026]  // Northeast corner
];

// Set the max bounds for the map
map.setMaxBounds(bounds);

// Add a tile layer using Google Satellite view
L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    minZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);


// Export the map
export { map };