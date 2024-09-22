import { map } from './map.js';

var markers = [];

/**
 * Get the color corresponding to the easel easelBoardId value
 * @param {*} value The value to extract the easelBoardId from, e.g. 'B-01' or 'BC-02'
 * @returns  The color corresponding to the easelBoardId value
 */
function getColorByEaselBoardId(value) {
    let easelBoardId = value.split('-')[0]; // Extract the easelBoardId
    let color;
    switch (easelBoardId) {
        case 'B':
            color = '#E69F00'; // orange
            break;
        case 'BC':
            color = '#56B4E9'; // sky blue
            break;
        case 'BCS':
            color = '#009E73'; // bluish green
            break;
        case 'BE':
            color = '#F0E442'; // yellow
            break;
        case 'C':
            color = '#0072B2'; // blue
            break;
        case 'CEP':
            color = '#D55E00'; // vermillion
            break;
        case 'CHC':
            color = '#CC79A7'; // reddish purple
            break;
        case 'CS':
            color = '#999999'; // gray
            break;
        case 'CSHC':
            color = '#E69F00'; // orange
            break;
        case 'CSM':
            color = '#56B4E9'; // sky blue
            break;
        case 'CSN':
            color = '#009E73'; // bluish green
            break;
        case 'E':
            color = '#0072B2'; // blue
            break;
        case 'EM':
            color = '#F0E442'; // yellow
            break;
        case 'M':
            color = '#D55E00'; // vermillion
            break;
        case 'O':
            color = '#CC79A7'; // reddish purple
            break;
        case 'P':
            color = '#999999'; // gray
            break;
        case 'SSEF':
            color = '#E69F00'; // orange
            break;
        default:
            color = '#000000'; // black for unrecognized easelBoardIdes
    }

    return color;
}

function getShapeByEaselBoardId(value) {
    let easelBoardId = value.split('-')[0]; // Extract the easelBoardId
    let shape;

    switch (easelBoardId) {
        case 'B':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'BC':
            shape = '<rect x="4" y="4" width="16" height="16"  />'; // Square
            break;
        case 'BCS':
            shape = '<polygon points="12,2 22,22 2,22"  />'; // Triangle
            break;
        case 'BE':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'C':
            shape = '<rect x="4" y="4" width="16" height="16"  />'; // Square
            break;
        case 'CEP':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'CHC':
            shape = '<path d="M 2 2 L 22 2 L 12 22 Z"  />'; // Inverted Triangle
            break;
        case 'CS':
            shape = '<path d="M 12 2 L 22 22 L 2 22 Z"  />'; // Inverted Triangle (alternative)
            break;
        case 'CSHC':
            shape = '<rect x="4" y="4" width="16" height="16"  />'; // Square
            break;
        case 'CSM':
            shape = '<path d="M 12 2 L 22 22 L 2 22 Z"  />'; // Same Triangle
            break;
        case 'CSN':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle;             break;
        case 'E':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle; 
            break;
        case 'EM':
            shape = '<polygon points="12,2 22,22 2,22"  />'; // Triangle
            break;
        case 'M':
            shape = '<path d="M 2 2 L 22 2 L 12 22 Z"  />'; // Inverted Triangle
            break;
        case 'O':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'P':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'SSEF':
            shape = '<polygon points="12,2 22,22 2,22" />'; // Triangle (same as other triangles)
            break;
        default:
            shape = '<text x="2" y="12" >?</text>'; // Default shape (question mark)
    }

    return shape;
}


// Get custom SVG icon based on easel board ID
function getCustomIcon(easelBoardId, size) {
    const color = getColorByEaselBoardId(easelBoardId);
    const shape = getShapeByEaselBoardId(easelBoardId);
    const svgIcon = L.divIcon({
        className: 'custom-div-icon', // Ensure the custom-div-icon class is applied
        html: `<div style="transform: scale(${size / 24});">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                    ${shape}
                </svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return svgIcon;
}

// Add a marker to the map
function addMarker(lat, lng, popupText, easelBoardId) {
    try {
        const zoomLevel = map.getZoom();
        const size = Math.max(19, zoomLevel * 2);
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
        adjustMarkerSize();
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
        console.error('Error loading CSV:', error);
    }
}

// Adjust marker size based on zoom level
function adjustMarkerSize() {
    const zoomLevel = map.getZoom();
    const newSize = zoomLevel == 20 ? 14 : (zoomLevel <= 21 ? 22 : 40); // Adjust sizes based on zoom level
    markers.forEach(({ marker, easelBoardId }) => {
        const newIcon = getCustomIcon(easelBoardId, newSize);
        marker.setIcon(newIcon);
    });
}

// Add event listener for zoomend to adjust marker size
map.on('zoomend', adjustMarkerSize);

loadMarkersFromCSV('2024-poster-session-coordinates.csv');