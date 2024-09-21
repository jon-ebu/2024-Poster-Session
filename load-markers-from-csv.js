import { map } from './map.js';

// Load markers from a CSV file and add a custom marker to the map
function addMarker(lat, lng, popupText) {
    if (lat && lng) {
        var marker = L.marker([lat, lng]).addTo(map);
    }
    if (popupText) {
        marker.bindPopup(popupText).openPopup();
    }
}

// Load and parse the CSV file
function loadMarkersFromCSV(csvPath) {
    Papa.parse(csvPath, {
        download: true,
        header: true,
        complete: function (results) {
            results.data.forEach(function (row) {
                if (row.latitude && row.longitude) {
                    var lat = parseFloat(row.latitude);
                    var lng = parseFloat(row.longitude);
                }
                if (!isNaN(lat) && !isNaN(lng)) {
                    addMarker(lat, lng, `Latitude: ${lat}, Longitude: ${lng}`);
                }
            });
        }
    });
}

loadMarkersFromCSV('2024-poster-session-coordinates.csv');