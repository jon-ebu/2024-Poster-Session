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
            var easelBoardId = row["Easel Board"];
            var tooltipDirection = row["Tooltip Direction"];
            var title = row["Poster Title"];
            var students = row["Students"];
            var faculty = row["Faculty"];
            var department = row["Poster Category"];
            var text = `<strong>${title}</strong><br><br><strong>Students</strong>: ${students}<br><strong>Faculty</strong>: ${faculty}<br><strong>Department/Team</strong>: ${department}<br><strong>Easel ID</strong>: ${easelBoardId} `;
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

/**
 * Focus on a specific marker and temporarily hide the rest
 * @param {*} lat The latitude of the marker
 * @param {*} lng The longitude of the marker
 */
function focusOnMarker(lat, lng) {
  const hiddenMarkers = [];

  markerObjs.forEach(marker => {
      if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
          marker.addTo(map);
          map.setView([lat, lng], 21);
          marker.openPopup();
      } else {
          map.removeLayer(marker);
          hiddenMarkers.push(marker);
      }
  });

  // Restore hidden markers after clicking anywhere on the map
  window.addEventListener("click", () => {
      hiddenMarkers.forEach(marker => marker.addTo(map));
  });
}

// Listen for messages from the table.js script
window.addEventListener('message', function (event) {
  console.log('Received:', event.data);
  if (event.data.lat && event.data.lng) {
      focusOnMarker(event.data.lat, event.data.lng);
  }
});

loadMarkersFromTSV("data/2024-poster-session-data.tsv");

