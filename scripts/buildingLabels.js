import { map } from './map.js';

// List of buildings with their coordinates and names
const buildings = [
    { name: 'PARSONS', lat: 34.1065746, lng: -117.7120766 },
    { name: 'SPRAGUE', lat: 34.1061271, lng: -117.7122939 },
    { name: 'JACOBS/KECK', lat: 34.1056818, lng:-117.7120122 },
    { name: 'HIXON COURTYARD', lat: 34.1061393, lng: -117.7116448 }
];

// Function to create a custom text label
function createTextLabel(name) {
    return L.divIcon({
        className: 'building-text-label',
        html: `<div>${name}</div>`,
        iconSize: null,        
    });
}

// Add text labels to the map
buildings.forEach(building => {
    const label = createTextLabel(building.name);
    L.marker([building.lat, building.lng], { icon: label }).addTo(map);
});


// Function to adjust the font size of the building text labels based on the zoom level
function adjustLabelSize() {
    const zoomLevel = map.getZoom();
    const newFontSize = zoomLevel <= 19 ? '10px' : (zoomLevel <= 21 ? '20px' : '40px'); // Adjust font sizes based on zoom level
    const labels = document.querySelectorAll('.building-text-label div');
    labels.forEach(label => {
        label.style.fontSize = newFontSize;
    });
}

// Event listener for zoomend to adjust label size
map.on('zoomend', adjustLabelSize);

// Initial adjustment of label size
adjustLabelSize();