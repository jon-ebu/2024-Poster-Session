import { map } from './map.js';

// Load markers from a CSV file and add a custom marker to the map
function addMarker(lat, lng, popupText) {
    try {
        var marker = L.marker([lat, lng]).addTo(map);
        console.log('Added marker:', marker);
        if (popupText) {
            marker.bindPopup(popupText).openPopup();
        }
    } catch (error) {
        console.error('Error adding marker:', error);
    }
}

// Load and parse the CSV file
function loadMarkersFromCSV(csvPath) {
    try {
        Papa.parse(csvPath, {
            download: true,
            header: true,
            complete: function (results) {
                console.log('CSV Data:', results.data);
                results.data.forEach(function (row) {
                    if (row.Latitude && row.Longitude) {
                        var lat = parseFloat(row.Latitude);
                        var lng = parseFloat(row.Longitude);
                        var easel = row['Easel Board']
                        var title = row['Poster Title']
                        var text = `<strong>Title: </strong>${title} <br> <strong>Easel: </strong>${easel}`
                        if (!isNaN(lat) && !isNaN(lng)) {
                            console.log('Adding marker at:', lat, lng);
                            addMarker(lat, lng, text);
                        } else {
                            console.warn('Invalid coordinates:', row);
                        }
                    } else {
                        console.warn('Missing coordinates:', row);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading markers from CSV:', error);
    }
}

loadMarkersFromCSV('2024-poster-session-coordinates.csv')