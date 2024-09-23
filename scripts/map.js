import { geojsonFeature_BUILDINGS } from "./buildingPolygons.js";
import { geojsonFeature_FLOOR } from "./floorPolygons.js";

var defaultLayer = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    minZoom: 18,
    maxZoom: 22,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
);

// Initialize map with HMC coordinates
var map = L.map("map", {
  center: [34.1061046, -117.7119814],
  zoom: 19, // Default zoom level
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

var floorLayer;
floorLayer = L.geoJSON(geojsonFeature_FLOOR, {
  style: function (feature) {
    return {
      color: "#000000", // Border color
      weight: 1, // Border width
      opacity: 1, // Border opacity
      fillColor: "#eadab8", // Fill color
      fillOpacity: 0.5, // Fill opacity
    };
  },

  onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }

    // Add click event listener to log coordinates
    /** 
         layer.on('click', function (e) {
            var coordinates = layer.getLatLngs();
            // var formattedCoordinates = coordinates[0].map(coord => `    [${coord.lng}, ${coord.lat}]`).join(',\n');
            // console.log('Polygon coordinates:\n' + formattedCoordinates);
        });
        layer.on('click', function () {
            layer.enableEdit(); // Enable editing on click
        });
        */
  },
});

var buildingLayer;
buildingLayer = L.geoJSON(geojsonFeature_BUILDINGS, {
  style: function (feature) {
    return {
      color: "#000000", // Border color
      weight: 2, // Border width
      opacity: 1, // Border opacity
      fillColor: "#aaaaaa", // Fill color
      fillOpacity: 1, // Fill opacity
    };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
    // Add click event listener to log coordinates
    /**
    layer.on("click", function (e) {
      var coordinates = layer.getLatLngs();
      var formattedCoordinates = coordinates[0]
        .map((coord) => `    [${coord.lng}, ${coord.lat}]`)
        .join(",\n");
      // console.log("Polygon coordinates:\n" + formattedCoordinates);
    });
    

    layer.on("click", function () {
      layer.enableEdit(); // Enable editing on click
    });
     */
  },
});

// Add the 2D view layer and floor layer to the map by default
buildingLayer.addTo(map);
floorLayer.addTo(map);
map.removeLayer(defaultLayer);

var baseLayers = {
  "2D View": buildingLayer,
  "Satellite View": defaultLayer,
};

// Ensure the floor layer is below the main polygon layer
floorLayer.setZIndex(0);
buildingLayer.setZIndex(1);

// Add the floor layer only to the 2D view
map.on("baselayerchange", function (e) {
  if (e.name === "2D View") {
    map.addLayer(floorLayer);
  } else {
    map.removeLayer(floorLayer);
  }
});

L.control.layers(baseLayers).addTo(map);

export { map };
