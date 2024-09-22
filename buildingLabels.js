import { map } from './map.js';

// List of buildings with their coordinates and names
const buildings = [
    { name: 'Parsons', lat: 34.1065491, lng: -117.7119928 },
    { name: 'Sprague', lat: 34.1061393, lng: -117.7122523 },
    { name: 'Keck/Jacobs', lat: 34.1056452, lng: -117.7120042 },
    { name: 'Olin', lat: 34.1065491, lng: -117.7127123 },
    { name: 'Hixon Courtyard', lat: 34.1061393, lng: -117.7116448 }
];

// Function to create a custom text label
function createTextLabel(name) {
    return L.divIcon({
        className: 'building-text-label',
        html: `<div>${name}</div>`,
        iconSize: null,
        iconAnchor: [50, 20] // Center the anchor point
        
    });
}

// Add text labels to the map
buildings.forEach(building => {
    const label = createTextLabel(building.name);
    L.marker([building.lat, building.lng], { icon: label }).addTo(map);
});