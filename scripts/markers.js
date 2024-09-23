import { map } from './map.js';
import { getCustomIcon } from './markerIcons.js';


var markers = [];

/**
 * Add a marker to the map
 * @param {*} lat 
 * @param {*} lng 
 * @param {*} popupText 
 * @param {*} easelBoardId 
 */
function addMarker(lat, lng, popupText, easelBoardId) {
    try {
        const zoomLevel = map.getZoom();
        const size = Math.max(8, zoomLevel * 2); // Adjust the formula as needed
        var customIcon = getCustomIcon(easelBoardId, size);
        var marker = L.marker([lat, lng], { icon: customIcon });

        // Bind popup and add hover events
        marker.bindPopup(popupText);
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });

        marker.addTo(map);
        markers.push({ marker, easelBoardId });
        // adjustMarkerSize();
    } catch (error) {
        console.error('Error adding marker:', error);
    }
}

/**
 * Adds markers to the map with coordinates and information from the TSV file
 * @param {*} tsvPath The file path to the TSV file
 */
function loadMarkersFromTSV(tsvPath) {
    try {
        Papa.parse(tsvPath, {
            download: true,
            header: true,
            complete: function (results) {
                results.data.forEach(function (row) {
                    if (row.Latitude && row.Longitude) {
                        var lat = parseFloat(row.Latitude);
                        var lng = parseFloat(row.Longitude);
                        var easelBoardId = row['Easel Board'];
                        var title = row['Poster Title'];
                        var students = row['Students'];
                        var faculty = row['Faculty'];
                        var department = row['Poster Category'];
                        var text = `<strong>${title}</strong><br><br><strong>Students</strong>: ${students}<br><strong>Faculty</strong>: ${faculty}<br><strong>Department/Team</strong>: ${department}`;
                        if (!isNaN(lat) && !isNaN(lng)) {
                            addMarker(lat, lng, text, easelBoardId);
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
        console.error('Error loading TSV:', error);
    }
}

/**
function adjustMarkerSize(easelBoardId) {
    const zoomLevel = map.getZoom();
    const newSize = zoomLevel == 20 ? 14 : (zoomLevel <= 21 ? 22 : 40); // Adjust sizes based on zoom level
    markers.forEach(({ marker }) => {
        const newIcon = getCustomIcon(easelBoardId, newSize);
        marker.setIcon(newIcon);
    });
}
    // Add event listener for zoomend to adjust marker size
map.on('zoomend', adjustMarkerSize);
 */




loadMarkersFromTSV('data/2024-poster-session-coordinates.tsv');
