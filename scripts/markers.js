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

// Function to create a custom blank icon
function createBlankIcon(size) {
    return L.divIcon({
        className: 'custom-blank-icon', // Add custom-blank-icon class
        html: `<div style="width: ${size}px; height: ${size}px;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
}

// Add a marker to the map
function addMarker(lat, lng, popupText, easelBoardId) {
    try {
        const color = getColorByEaselBoardId(easelBoardId);
        const zoomLevel = map.getZoom();
        const size = Math.max(19, zoomLevel * 2);
        const blankIcon = createBlankIcon(size);
        var marker = new L.marker([lat, lng],  { icon: blankIcon }).on('click', function (e) {
        });
        marker.bindTooltip(easelBoardId,
            {
            permanent: true,
            direction: 'center',
            className: "easel-label",
            offset: [-3, -5.5] // Adjust the vertical offset to position the tooltip above the marker

         });

        // Set the tooltip background color
        console.log(marker.getTooltip().getElement())

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

// Load and parse the TSV file
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

// Adjust marker size based on zoom level
function adjustMarkerSize() {
    const zoomLevel = map.getZoom();
    const newSize = zoomLevel == 20 ? 14 : (zoomLevel <= 21 ? 22 : 40); // Adjust sizes based on zoom level
    markers.forEach(({ marker }) => {
        const newIcon = createBlankIcon(newSize);
        marker.setIcon(newIcon);
    });
}

// Add event listener for zoomend to adjust marker size
map.on('zoomend', adjustMarkerSize);

loadMarkersFromTSV('2024-poster-session-coordinates.tsv');