import { initializeFooTable } from "./initializeFooTable.js";

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
      if (tableData[0][index + 2] === "Poster Title") {
        row += `<td class="poster-title">${cell}</td>`;
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
  fetch("data/2024-poster-session-data.tsv")
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
  const mapIframe = window.parent.document.getElementById("mapIframe");
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
      if (mapIframe.contentWindow) {
        // Send a message to markers.js
        mapIframe.contentWindow.postMessage({ action: "unhideMarkers" }, "*");
        // console.log('Row collapsed');
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
        if (mapIframe.contentWindow) {
          mapIframe.contentWindow.postMessage(
            { action: "focusMarker", lat: lat, lng: lng },
            "*"
          );
        }
      }
    },
  });
}

/** Functions to focus on a row when a marker is selected */
function focusRow(lat, lng) {
  const row = document.querySelector(
    `#tsvTable tbody tr[data-lat="${lat}"][data-lng="${lng}"]`
  );
  if (row) {
    row.classList.add("highlight"); // Add a class to highlight the row
        setTimeout(() => {
      $(row).find(".footable-toggle").click(); // Expand the row after 1 second
    }, 1000);
    setTimeout(() => row.classList.remove("highlight"), 2000); // Remove the highlight after 2 seconds
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    console.error("Row not found for the given coordinates");
  }
}


// Listen for messages from the iframe
window.addEventListener("message", function (event) {
  if (event.data.action === "focusRow") {
    // console.log('Received message to focus on row:', event.data);
    const { lat, lng } = event.data;
    focusRow(lat, lng);
  }
});

// Add CSS for the highlight class
const style = document.createElement("style");
style.innerHTML = `
  .highlight {
    background-color: #fdb913;
  }
`;
document.head.appendChild(style);
