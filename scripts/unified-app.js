// Unified Poster Session App - No iframes, direct communication
// Combines map and table functionality in a single page

// Import functions (we'll copy the essential parts to avoid module issues)
import { geojsonFeature_BUILDINGS } from "./buildingPolygons.js";
import { geojsonFeature_FLOOR } from "./floorPolygons.js";
import { getCustomIcon, getColorByEaselBoardId } from "./markerIcons.js";

// Global variables
let map;
let markers = [];
let markerObjs = [];
let hiddenMarkers = [];
let openPopUp = null;
let isFullscreen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeTable();
    loadData();
});

// Initialize the map
function initializeMap() {
    console.log('Initializing map...');
    
    var defaultLayer = L.tileLayer(
        "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
            minZoom: 18,
            maxZoom: 22,
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
    );

    // Initialize map with HMC coordinates
    map = L.map("map", {
        center: [34.1061046, -117.7119814],
        zoom: 19,
        maxZoom: 22,
        minZoom: 18,
        zoomDelta: 1,
        zoomSnap: 1,
        editable: false,
        layers: [defaultLayer],
    });

    var bounds = [
        [34.1054531, -117.7130985], // Southwest corner
        [34.1068478, -117.7111942], // Northeast corner
    ];

    map.setMaxBounds(bounds);

    // Add floor and building layers
    var floorLayer = L.geoJSON(geojsonFeature_FLOOR, {
        style: function (feature) {
            return {
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillColor: "#eadab8",
                fillOpacity: 0.5,
            };
        },
    });

    var buildingLayer = L.geoJSON(geojsonFeature_BUILDINGS, {
        style: function (feature) {
            return {
                color: "#000000",
                weight: 2,
                opacity: 1,
                fillColor: "#aaaaaa",
                fillOpacity: 1,
            };
        },
    });

    buildingLayer.addTo(map);
    floorLayer.addTo(map);
    map.removeLayer(defaultLayer);

    var baseLayers = {
        "2D View": buildingLayer,
        "Satellite View": defaultLayer,
    };

    floorLayer.setZIndex(0);
    buildingLayer.setZIndex(1);

    map.on("baselayerchange", function (e) {
        if (e.name === "2D View") {
            map.addLayer(floorLayer);
        } else {
            map.removeLayer(floorLayer);
        }
    });

    L.control.layers(baseLayers).addTo(map);

    // Add fullscreen control
    addFullscreenControl();

    // Add zoom event listeners
    map.on("zoomend", () => {
        adjustMarkerSize();
        toggleTooltips();
        adjustTooltipSize();
    });

    // Add click event to restore hidden markers
    map.on("click", () => {
        restoreHiddenMarkers();
    });

    console.log('Map initialized successfully');
}

// Add fullscreen control
function addFullscreenControl() {
    L.Control.Fullscreen = L.Control.extend({
        onAdd: function(map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-fullscreen');
            
            this._button = L.DomUtil.create('a', 'leaflet-control-fullscreen-button', container);
            this._button.href = '#';
            this._button.title = 'Toggle Fullscreen';
            this._button.setAttribute('role', 'button');
            this._button.setAttribute('aria-label', 'Toggle Fullscreen');
            this._button.innerHTML = '<span class="fullscreen-icon">⛶</span>';
            
            L.DomEvent.on(this._button, 'click', this._toggleFullscreen, this);
            L.DomEvent.disableClickPropagation(container);
            
            return container;
        },
        
        _toggleFullscreen: function(e) {
            L.DomEvent.preventDefault(e);
            
            const appContainer = document.querySelector('.app-container');
            const fullscreenIcon = this._button.querySelector('.fullscreen-icon');
            
            if (!isFullscreen) {
                // Enter fullscreen
                appContainer.classList.add('fullscreen-active');
                fullscreenIcon.textContent = '⛉';
                isFullscreen = true;
                
                // Use browser fullscreen API
                if (document.body.requestFullscreen) {
                    document.body.requestFullscreen();
                } else if (document.body.webkitRequestFullscreen) {
                    document.body.webkitRequestFullscreen();
                } else if (document.body.msRequestFullscreen) {
                    document.body.msRequestFullscreen();
                } else if (document.body.mozRequestFullScreen) {
                    document.body.mozRequestFullScreen();
                }
            } else {
                // Exit fullscreen
                appContainer.classList.remove('fullscreen-active');
                fullscreenIcon.textContent = '⛶';
                isFullscreen = false;
                
                // Exit browser fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
            }
            
            // Trigger map resize
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    });
    
    L.control.fullscreen = function(opts) {
        return new L.Control.Fullscreen(opts);
    };
    
    var fullscreenControl = L.control.fullscreen({ position: 'topleft' });
    fullscreenControl.addTo(map);
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement && isFullscreen) {
            const appContainer = document.querySelector('.app-container');
            const fullscreenIcon = document.querySelector('.fullscreen-icon');
            appContainer.classList.remove('fullscreen-active');
            fullscreenIcon.textContent = '⛶';
            isFullscreen = false;
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    });
}

// Add marker to map
function addMarker(lat, lng, popupText, easelBoardId, tooltipText, tooltipDirection = "top") {
    try {
        var customIcon = getCustomIcon(easelBoardId, 40);
        var marker = L.marker([lat, lng], {
            icon: customIcon,
            riseOnHover: true,
        });

        marker.bindPopup(popupText);
        marker.on("mouseover", function (e) {
            this.openPopup();
        });
        marker.on("mouseout", function (e) {
            this.closePopup();
        });

        marker.bindTooltip(tooltipText, {
            permanent: true,
            direction: tooltipDirection,
            minZoom: 21,
        });

        marker.on("tooltipopen", function () {
            var tooltipElement = document.querySelector(".leaflet-tooltip");
            if (tooltipElement) {
                tooltipElement.addEventListener("mouseover", function () {
                    marker.openPopup();
                });
            }
        });

        // DIRECT COMMUNICATION - No iframes!
        marker.on('click', function () {
            const lat = marker.getLatLng().lat;
            const lng = marker.getLatLng().lng;
            console.log(`Marker clicked: lat=${lat}, lng=${lng}`);
            focusRow(lat, lng); // Direct function call!
        });

        marker.addTo(map);
        markerObjs.push(marker);
        markers.push({ marker, easelBoardId });
        adjustMarkerSize();
    } catch (error) {
        console.error("Error adding marker:", error);
    }
}

// Marker utility functions
function adjustMarkerSize() {
    const zoomLevel = map.getZoom();
    const newSize = zoomLevel <= 20 ? 14 : zoomLevel <= 21 ? 22 : 40;
    markers.forEach(({ marker, easelBoardId }) => {
        const newIcon = getCustomIcon(easelBoardId, newSize);
        marker.setIcon(newIcon);
    });
}

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

function adjustTooltipSize() {
    const zoomLevel = map.getZoom();
    const newFontSize = zoomLevel <= 20 ? "10px" : zoomLevel <= 21 ? "12px" : "14px";
    const tooltips = document.querySelectorAll(".leaflet-tooltip");
    tooltips.forEach((tooltip) => {
        tooltip.style.fontSize = newFontSize;
    });
}

// Focus on specific marker
function focusOnMarker(lat, lng) {
    console.log(`Focusing on marker: lat=${lat}, lng=${lng}`);
    hiddenMarkers = [];
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

function restoreHiddenMarkers() {
    hiddenMarkers.forEach(marker => marker.addTo(map));
    hiddenMarkers = [];
    toggleTooltips();
    if (openPopUp) {
        map.closePopup(openPopUp);
        openPopUp = null;
    }
}

// Initialize table
function initializeTable() {
    console.log('Initializing table...');
    // Table initialization will happen when data is loaded
}

// Create color icon for table
function createColorIcon(easelId) {
    const color = getColorByEaselBoardId(easelId);
    return `<svg width="16" height="16" viewBox="0 0 24 24" style="display: inline-block; margin-right: 8px; vertical-align: middle;">
              <circle cx="12" cy="12" r="10" fill="${color}"/>
            </svg>`;
}

// Display table
function displayTable(tableData) {
    const table = document.getElementById("tsvTable");
    table.innerHTML = "";

    // Generate headers
    let headerRow = "<thead><tr>";
    tableData[0].slice(3).forEach((header) => {
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

    // Generate rows
    let bodyRows = "<tbody>";
    for (let i = 1; i < tableData.length; i++) {
        const lat = tableData[i][0];
        const lng = tableData[i][1];
        let row = `<tr data-lat="${lat}" data-lng="${lng}">`;
        tableData[i].slice(3).forEach((cell, index) => {
            const headerName = tableData[0][index + 3];
            if (headerName === "Poster Title") {
                row += `<td class="poster-title">${cell}</td>`;
            } else if (headerName === "Easel") {
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

    // Initialize FooTable
    $("#tsvTable").footable({
        sorting: { enabled: true },
        filtering: { 
            enabled: true,
            focus: false,
            container: "#filter-form-container",
        },
        toggle: true,
        paging: { enabled: false, limit: 1000 },
        'on': {
            'postinit.ft.table': function (e, ft) {
                const easelColumnIndex = 6; 
                ft.sort(easelColumnIndex, 'asc');
            }
        }
    });

    // Add table event listeners
    $("#tsvTable").on("footable_toggle", function (e) {
        var $currentToggle = $(e.target).closest("tr");
        if ($currentToggle.attr("data-expanded") === "true") {
            $("#tsvTable")
                .find('tr[data-expanded="true"]')
                .not($currentToggle)
                .each(function () {
                    $(this).removeAttr("data-expanded");
                });
        } else {
            $currentToggle.attr("data-expanded", "true");
        }
    });

    // Bind table events
    $("#tsvTable").bind({
        "collapse.ft.row": function () {
            restoreHiddenMarkers();
        },
        "expand.ft.row": function (e, ft, row) {
            // Collapse other rows
            $('#tsvTable tbody tr[data-expanded="true"]').each(function () {
                if (this !== row) {
                    $(this).find(".footable-toggle").click();
                }
            });

            // Get coordinates and focus marker
            const lat = parseFloat($(row).data("lat"));
            const lng = parseFloat($(row).data("lng"));
            
            if (lat && lng) {
                console.log(`Row expanded, focusing marker: lat=${lat}, lng=${lng}`);
                focusOnMarker(lat, lng); // Direct function call!
            }
        },
    });

    console.log('Table initialized successfully');
}

// Focus on table row (called by marker clicks)
function focusRow(lat, lng) {
    console.log(`Focusing on table row: lat=${lat}, lng=${lng}`);
    
    // Try exact match first
    let row = document.querySelector(`#tsvTable tbody tr[data-lat="${lat}"][data-lng="${lng}"]`);
    
    // If exact match fails, try with rounded coordinates
    if (!row) {
        const roundedLat = parseFloat(lat).toFixed(7);
        const roundedLng = parseFloat(lng).toFixed(7);
        
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
        
        // Collapse other expanded rows
        $('#tsvTable tbody tr[data-expanded="true"]').each(function () {
            if (this !== row) {
                $(this).find(".footable-toggle").click();
            }
        });
        
        // Highlight and expand
        row.classList.add("highlight");
        $(row).find(".footable-toggle").click();
        setTimeout(() => row.classList.remove("highlight"), 3000);
        row.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        console.error(`Row not found for coordinates lat: ${lat}, lng: ${lng}`);
    }
}

// Load data and initialize everything
function loadData() {
    console.log('Loading data...');
    
    Papa.parse("data/2024-poster-session-data.tsv", {
        download: true,
        header: true,
        complete: function (results) {
            console.log(`Data loaded: ${results.data.length} rows`);
            
            // Process data for table
            const tableData = [Object.keys(results.data[0])];
            results.data.forEach(row => {
                if (row.Latitude && row.Longitude) {
                    tableData.push(Object.values(row));
                }
            });
            
            // Initialize table
            displayTable(tableData);
            
            // Add markers
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
                        addMarker(lat, lng, text, easelBoardId, easelBoardId, tooltipDirection);
                    } else {
                        console.warn("Invalid coordinates:", row);
                    }
                } else {
                    console.warn("Missing coordinates:", row);
                }
            });
            
            toggleTooltips();
            console.log('Application fully loaded!');
        },
        error: function(error) {
            console.error('Error loading data:', error);
        }
    });
}
