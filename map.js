// Define the geographical bounds
var bounds = [
    [34.1055463, -117.7123690], // Southwest corner
    [34.1066834, -117.71166090]  // Northeast corner
];


// Initialize map and add a layer using Google Satellite view
var map = L.map('map').setView([34.106109928727946, -117.7120061219193], 20);

// Set the max bounds for the map
map.setMaxBounds(bounds);

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 25,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

// Export the map
export { map };