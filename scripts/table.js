import { initializeFooTable } from "./initializeFooTable.js";
import { getColorByEaselBoardId } from "./markerIcons.js";

/**
 * Creates a color icon for the easel ID
 * @param {string} easelId - The easel ID (e.g., "B-1", "BC-2")
 * @returns {string} HTML string for the color icon
 */
function createColorIcon(easelId) {
  const color = getColorByEaselBoardId(easelId);
  return `<svg width="16" height="16" viewBox="0 0 24 24" style="display: inline-block; margin-right: 8px; vertical-align: middle;">
            <circle cx="12" cy="12" r="10" fill="${color}"/>
          </svg>`;
}

function displayTable(tableData) {
  const table = document.getElementById("tsvTable");
  table.innerHTML = "";

  // Generate table headers
  let headerRow = "<thead><tr>";
  tableData[0].slice(3).forEach((header) => {
    // Skip the first two columns
    if (header === "Easel") {
      headerRow += `<th>${header}</th>`;
    } else if (header === "Poster Title") {
      headerRow += `<th class="poster-title">${header}</th>`;
    } else {
      headerRow += `<th data-breakpoints="xs">${header}</th>`;
    }
  });
  headerRow += "</tr></thead>";
  table.innerHTML += headerRow;

  // Generate table rows
  let bodyRows = "<tbody>";
  for (let i = 1; i < tableData.length; i++) {
    // Start from 1 to skip the header row
    const lat = tableData[i][0]; // Assuming latitude is in the first column
    const lng = tableData[i][1]; // Assuming longitude is in the second column
    let row = `<tr data-lat="${lat}" data-lng="${lng}">`;
    tableData[i].slice(3).forEach((cell, index) => {
      // Skip the first three columns
      const headerName = tableData[0][index + 3]; // Adjust index to match sliced data
      if (headerName === "Poster Title") {
        row += `<td class="poster-title">${cell}</td>`;
      } else if (headerName === "Easel") {
        // Add color icon next to easel number
        const colorIcon = createColorIcon(cell);
        row += `<td class="easel-cell">${colorIcon}${cell}</td>`;
      } else {
        row += `<td>${cell}</td>`;
      }
    });
    row += "</tr>";
    bodyRows += row;
  }
  bodyRows += "</tbody>";
  table.innerHTML += bodyRows;

  // Initialize FooTable after table is generated
  initializeFooTable();
}

// Attach row listener for pagination clicks
$("#paging-ui-container").on("click", function () {
  attachRowListeners();
});

// Wait for the DOM to load and load the TSV file and add event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Fetch the TSV file using AJAX
  fetch("data/2025-poster-session-data.tsv")
    .then((response) => response.text())
    .then((text) => {
      const rows = text.split("\n");
      const tableData = rows.map((row) =>
        row.split("\t").map((cell) => cell.trim())
      );
      displayTable(tableData);
      attachRowListeners();
    })
    .catch((error) => console.error("Error fetching TSV file:", error));
});

// Function to attach event listeners to table rows
let clickedRowLat, clickedRowLng;

async function attachRowListeners() {
  let lat, lng;
  // Ensure the DOM is fully loaded before adding event listeners
  // Get a reference to the iframe containing map.html
  function getMapIframe() {
    // Try different ways to get the map iframe depending on fullscreen state
    let mapIframe = null;
    
    // First, try the normal parent document approach
    if (window.parent && window.parent.document) {
      mapIframe = window.parent.document.getElementById("mapIframe");
    }
    
    // If not found and we might be in fullscreen, try top-level document
    if (!mapIframe && window.top && window.top.document) {
      mapIframe = window.top.document.getElementById("mapIframe");
    }
    
    // If still not found, try looking in all frames
    if (!mapIframe) {
      try {
        const frames = window.parent.frames;
        for (let i = 0; i < frames.length; i++) {
          if (frames[i].name === 'mapIframe' || 
              frames[i].document.querySelector('#map')) {
            return frames[i];
          }
        }
      } catch (e) {
        // Cross-origin or access issues
      }
    }
    
    return mapIframe;
  }
  
  const mapIframe = getMapIframe();
  if (!mapIframe) {
    console.error("Map iframe is not available");
    return;
  }

  // Add click event listeners to table rows and update clickedRowLat and clickedRowLng
  document.querySelectorAll("#tsvTable tbody tr").forEach((row) => {
    row.addEventListener("click", function () {
      clickedRowLat = parseFloat($(this).data("lat"));
      clickedRowLng = parseFloat($(this).data("lng"));
    });
  });

  // Function to wait for clickedRowLat and clickedRowLng to be updated
  function waitForCoordinates() {
    return new Promise((resolve, reject) => {
      const checkCoordinates = () => {
        if (clickedRowLat !== undefined && clickedRowLng !== undefined) {
          resolve();
        } else {
          setTimeout(checkCoordinates, 50); // Check every 50ms
        }
      };
      checkCoordinates();
    });
  }

  // Add event listeners to the table for collapsed and expanded rows
  $("#tsvTable").bind({
    "collapse.ft.row": function () {
      if (mapIframe && mapIframe.contentWindow) {
        // Send a message to markers.js
        mapIframe.contentWindow.postMessage({ action: "unhideMarkers" }, "*");
        // console.log('Row collapsed');
      } else {
        // Fallback: try broadcasting to all windows
        try {
          window.top.postMessage({ action: "unhideMarkers" }, "*");
        } catch (e) {
          console.error("Failed to send unhide message:", e);
        }
      }
    },
    "expand.ft.row": async function (e, ft, row) {
      if (mapIframe.contentWindow) {
        // console.log('Row expanded');

        // Collapse any other expanded rows
        $('#tsvTable tbody tr[data-expanded="true"]').each(function () {
          if (this !== row) {
            $(this).find(".footable-toggle").click(); // Collapse the row
          }
        });

        // Reset coordinates to ensure fresh values are used
        clickedRowLat = undefined;
        clickedRowLng = undefined;

        // Wait for clickedRowLat and clickedRowLng to be updated
        await waitForCoordinates();

        // Update lat and lng variables
        lat = clickedRowLat;
        lng = clickedRowLng;
        if (!lat || !lng) {
          console.error("Latitude or longitude is missing");
          return;
        }
        // console.log(`Updated lat: ${lat}, lng: ${lng}`);
        if (mapIframe && mapIframe.contentWindow) {
          mapIframe.contentWindow.postMessage(
            { action: "focusMarker", lat: lat, lng: lng },
            "*"
          );
        } else {
          // Fallback: try broadcasting to all windows
          try {
            window.top.postMessage(
              { action: "focusMarker", lat: lat, lng: lng },
              "*"
            );
          } catch (e) {
            console.error("Failed to send focus message:", e);
          }
        }
      }
    },
  });
}

/** Functions to focus on a row when a marker is selected */
function focusRow(lat, lng) {
  console.log(`Attempting to focus row with lat: ${lat}, lng: ${lng}`);
  
  // Try exact match first
  let row = document.querySelector(
    `#tsvTable tbody tr[data-lat="${lat}"][data-lng="${lng}"]`
  );
  
  // If exact match fails, try with rounded coordinates (to handle floating point precision issues)
  if (!row) {
    const roundedLat = parseFloat(lat).toFixed(7);
    const roundedLng = parseFloat(lng).toFixed(7);
    
    // Search through all rows to find a close match
    const rows = document.querySelectorAll('#tsvTable tbody tr[data-lat][data-lng]');
    for (const r of rows) {
      const rowLat = parseFloat(r.getAttribute('data-lat')).toFixed(7);
      const rowLng = parseFloat(r.getAttribute('data-lng')).toFixed(7);
      
      if (rowLat === roundedLat && rowLng === roundedLng) {
        row = r;
        break;
      }
    }
  }
  
  if (row) {
    console.log('Row found, highlighting and expanding');
    
    // Collapse any currently expanded rows first
    $('#tsvTable tbody tr[data-expanded="true"]').each(function () {
      if (this !== row) {
        $(this).find(".footable-toggle").click();
      }
    });
    
    // Add highlight and expand
    row.classList.add("highlight");
    $(row).find(".footable-toggle").click();
    setTimeout(() => row.classList.remove("highlight"), 3000); // Increased timeout
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    console.error(`Row not found for coordinates lat: ${lat}, lng: ${lng}`);
    
    // Debug: log all available coordinates
    const allRows = document.querySelectorAll('#tsvTable tbody tr[data-lat][data-lng]');
    console.log('Available coordinates:');
    allRows.forEach((r, index) => {
      if (index < 5) { // Log first 5 for debugging
        console.log(`Row ${index}: lat=${r.getAttribute('data-lat')}, lng=${r.getAttribute('data-lng')}`);
      }
    });
  }
}


// Listen for messages from the iframe and other windows
function handleFocusMessage(event) {
  if (event.data.action === "focusRow") {
    console.log('Received message to focus on row:', event.data);
    const { lat, lng } = event.data;
    focusRow(lat, lng);
  }
}

// Listen for messages from multiple sources
window.addEventListener("message", handleFocusMessage);

// Also listen for messages from parent and top windows (for fallback communication)
if (window.parent && window.parent !== window) {
  window.parent.addEventListener("message", handleFocusMessage);
}

if (window.top && window.top !== window) {
  window.top.addEventListener("message", handleFocusMessage);
}

// Add CSS for the highlight class
const style = document.createElement("style");
style.innerHTML = `
  .highlight {
    background-color: #fdb913;
  }
`;
document.head.appendChild(style);
