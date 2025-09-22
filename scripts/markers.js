import { map } from "./map.js";
import { getCustomIcon } from "./markerIcons.js";

var markers = [];
var markerObjs = [];
/**
 * Add a marker to the map
 * @param {*} lat
 * @param {*} lng
 * @param {*} popupText
 * @param {*} easelBoardId
 * @param {string} tooltipText - Text to display in the tooltip
 * @param {string} tooltipDirection - Direction of the tooltip (top, bottom, left, right, center, auto)
 */
function addMarker(
  lat,
  lng,
  popupText,
  easelBoardId,
  tooltipText,
  tooltipDirection = "top",
) {
  try {
    const zoomLevel = map.getZoom();
    const size = Math.max(8, zoomLevel * 2); // Adjust the formula as needed
    var customIcon = getCustomIcon(easelBoardId, 40);
    var marker = L.marker([lat, lng], {
      icon: customIcon,
      riseOnHover: true, // Bring marker to front on hover
    });

    // Bind popup and add hover events
    marker.bindPopup(popupText);
    marker.on("mouseover", function (e) {
      this.openPopup();
    });
    marker.on("mouseout", function (e) {
      this.closePopup();
    });

    // Bind tooltip with specified direction
    marker.bindTooltip(tooltipText, {
      permanent: true,
      direction: tooltipDirection,
      minZoom: 21,
    });

    // Add event listener to tooltip to open popup on hover
    marker.on("tooltipopen", function () {
      var tooltipElement = document.querySelector(".leaflet-tooltip");
      if (tooltipElement) {
        tooltipElement.addEventListener("mouseover", function () {
          marker.openPopup();
        });
      }
    });
    marker.addTo(map);
    /** Event listener to help focus on a row when selecting a marker */
    function getTableIframe() {
      // Try different ways to get the table iframe depending on fullscreen state
      let tableIframe = null;
      
      // First, try the normal parent document approach
      if (window.parent && window.parent.document) {
        tableIframe = window.parent.document.getElementById('tableIframe');
      }
      
      // If not found and we might be in fullscreen, try top-level document
      if (!tableIframe && window.top && window.top.document) {
        tableIframe = window.top.document.getElementById('tableIframe');
      }
      
      // If still not found, try looking in all frames
      if (!tableIframe) {
        try {
          const frames = window.parent.frames;
          for (let i = 0; i < frames.length; i++) {
            if (frames[i].name === 'tableIframe' || 
                frames[i].document.querySelector('#tsvTable')) {
              return frames[i];
            }
          }
        } catch (e) {
          // Cross-origin or access issues
        }
      }
      
      return tableIframe;
    }
    
    marker.addEventListener('click', function () {
      const lat = marker.getLatLng().lat;
      const lng = marker.getLatLng().lng;
      console.log(`Marker clicked with coordinates: lat=${lat}, lng=${lng}`);
      
      const tableIframe = getTableIframe();
      if (tableIframe && tableIframe.contentWindow) {
        try {
          tableIframe.contentWindow.postMessage({ action: 'focusRow', lat: lat, lng: lng }, '*');
          console.log('Message sent to table iframe');
        } catch (error) {
          console.error('Error sending message to table iframe:', error);
        }
      } else {
        console.log('Table iframe not available, trying fallback communication');
        
        // Fallback: try broadcasting to all windows
        try {
          if (window.top && window.top !== window) {
            window.top.postMessage({ action: 'focusRow', lat: lat, lng: lng }, '*');
            console.log('Fallback message sent to top window');
          }
          
          // Also try parent window
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ action: 'focusRow', lat: lat, lng: lng }, '*');
            console.log('Fallback message sent to parent window');
          }
        } catch (error) {
          console.error('Error in fallback communication:', error);
        }
      }
    });
    markerObjs.push(marker);
    markers.push({ marker, easelBoardId });
    adjustMarkerSize();
  } catch (error) {
    console.error("Error adding marker:", error);
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
            var easelBoardId = row["Easel"];
            var tooltipDirection = row["Tooltip Direction"];
            var title = row["Poster Title"];
            var students = row["Students"];
            var faculty = row["Faculty"];
            var department = row["Poster Category"];
            var text = `<strong>${title}</strong><br><br><strong>`;
            if (!isNaN(lat) && !isNaN(lng)) {
              addMarker(
                lat,
                lng,
                text,
                easelBoardId,
                easelBoardId,
                tooltipDirection,
              );
            } else {
              console.warn("Invalid coordinates:", row);
            }
          } else {
            console.warn("Missing coordinates:", row);
          }
        });
        toggleTooltips(); // Ensure tooltips are correctly toggled on load
      },
    });
  } catch (error) {
    console.error("Error loading TSV:", error);
  }
}

/**
 * Adjusts the size of the markers based on the zoom level
 */
function adjustMarkerSize() {
  const zoomLevel = map.getZoom();
  const newSize = zoomLevel <= 20 ? 14 : zoomLevel <= 21 ? 22 : 40; // Adjust sizes based on zoom level
  markers.forEach(({ marker, easelBoardId }) => {
    const newIcon = getCustomIcon(easelBoardId, newSize);
    marker.setIcon(newIcon);
  });
}

/**
 * Toggles tooltips based on the zoom level
 */
function toggleTooltips() {
  const zoomLevel = map.getZoom();
  markers.forEach(({ marker }) => {
    if (zoomLevel <= 19) {
      marker.closeTooltip();
    } else {
      marker.openTooltip();
    }
  });
}

/**
 * Adjusts the font size of the tooltips based on the zoom level
 */
function adjustTooltipSize() {
  const zoomLevel = map.getZoom();
  const newFontSize =
    zoomLevel <= 20 ? "10px" : zoomLevel <= 21 ? "12px" : "14px"; // Adjust font sizes based on zoom level
  const tooltips = document.querySelectorAll(".leaflet-tooltip");
  tooltips.forEach((tooltip) => {
    tooltip.style.fontSize = newFontSize;
  });
}

// Event listener for zoomend to adjust marker size and toggle tooltips
map.on("zoomend", () => {
  adjustMarkerSize();
  toggleTooltips();
  adjustTooltipSize();
});

/** Functions for focusing on a marker when clicking a row" */
var hiddenMarkers = [];
let openPopUp = null;
/**
 * Focus on a specific marker and temporarily hide the rest
 * @param {*} lat The latitude of the marker
 * @param {*} lng The longitude of the marker
 */
function focusOnMarker(lat, lng) {
  hiddenMarkers = []; // Clear the hiddenMarkers array
  markerObjs.forEach(marker => {
    if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
      marker.addTo(map);
      map.zoomLevel = 21;
      map.panTo([lat, lng], {animate: true, duration: 2.0, easeLinearity: 2.0});
      marker.openPopup();
      openPopUp = marker.getPopup();
    } else {
      map.removeLayer(marker);
      hiddenMarkers.push(marker);
    }
  });
}

// Restore hidden markers and close popup
function restoreHiddenMarkers() {
  // console.log(hiddenMarkers)
  hiddenMarkers.forEach(marker => marker.addTo(map));
  hiddenMarkers = []; // Clear the hiddenMarkers array after restoring
  toggleTooltips(); // Ensure tooltips are correctly toggled again
  // Simulate a click on the screen
  document.body.click();
  if (openPopUp) {
    map.closePopup(openPopUp);
    openPopUp = null;
  }
}

// Restore hidden markers when a row is collapsed, otherwise
// focusOnMarker
function handleMessage(event) {
  if (event.data.action === 'unhideMarkers') {
    restoreHiddenMarkers();
    toggleTooltips(); // Ensure tooltips are correctly toggled again
  } else if (event.data.action === 'focusMarker' && event.data.lat && event.data.lng) {
    focusOnMarker(event.data.lat, event.data.lng);
  }
}

// Listen for messages from both the immediate window and top window
window.addEventListener('message', handleMessage);

// Also listen for messages from the top window (for fullscreen mode)
if (window.top !== window) {
  window.top.addEventListener('message', handleMessage);
}

// Restore hidden markers after clicking anywhere on the map
window.addEventListener("click", () => {
  restoreHiddenMarkers();
});


loadMarkersFromTSV("data/2025-poster-session-data.tsv");

