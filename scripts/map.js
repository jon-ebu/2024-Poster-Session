// Initialize map with HMC coordinates
var map = L.map('map', {
    center: [34.1061046, -117.7119814],
    zoom: 19, // Default zoom level
    maxZoom: 19,
    minZoom: 18,
    zoomDelta: 1,
    zoomSnap: 1,
    editable: true // Enable Leaflet.Editable
});

// Define the geographical bounds
var bounds = [
    [34.1059611, -117.7128357], // Southwest corner
    [34.1066190, -117.7109420]  // Northeast corner
];

// map.setMaxBounds(bounds);

// Tile layer using OpenStreetMap (default Leaflet map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 18,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// GeoJSON data for polygons
var geojsonFeature = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Parsons",
                "popupContent": "This is Parsons"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [
                        -117.712337,
                        34.106652
                    ],
                    [
                        -117.711682,
                        34.106652
                    ],
                    [
                        -117.711688,
                        34.106286
                    ],
                    [
                        -117.711889,
                        34.106286
                    ],
                    [
                        -117.711892,
                        34.106479
                    ],
                    [
                        -117.712093,
                        34.106481
                    ],
                    [
                        -117.712098,
                        34.106284
                    ],
                    [
                        -117.712339,
                        34.106284
                    ],
                    [
                        -117.712337,
                        34.106652
                    ]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Parsons",
                "popupContent": "This is Sprague"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -117.712374,
                            34.106233
                        ],
                        [
                            -117.712085,
                            34.10623
                        ],
                        [
                            -117.71209,
                            34.105975
                        ],
                        [
                            -117.712377,
                            34.105975
                        ],
                        [
                            -117.712374,
                            34.106233
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Jacobs/Keck",
                "popupContent": "This is Polygon 1"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -117.712297,
                            34.105917
                        ],
                        [
                            -117.712093,
                            34.105917
                        ],
                        [
                            -117.712098,
                            34.105722
                        ],
                        [
                            -117.711908,
                            34.105722
                        ],
                        [
                            -117.711897,
                            34.105915
                        ],
                        [
                            -117.711693,
                            34.105913
                        ],
                        [
                            -117.711698,
                            34.105668
                        ],
                        [
                            -117.711647,
                            34.105668
                        ],
                        [
                            -117.711647,
                            34.105606
                        ],
                        [
                            -117.711696,
                            34.105606
                        ],
                        [
                            -117.711698,
                            34.105544
                        ],
                        [
                            -117.71231,
                            34.105553
                        ],
                        [
                            -117.712297,
                            34.105917
                        ]
                    ]
                ]
            }
        },
    ]
};

// Add polygons to the map
L.geoJSON(geojsonFeature, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
        layer.on('click', function () {
            layer.enableEdit(); // Enable editing on click
        });
    }
}).addTo(map);

// Listen for editable events to get polygon data
map.on('editable:editing', function (event) {
    console.log('Editing started:', event.layer.toGeoJSON());
});

map.on('editable:edited', function (event) {
    console.log('Editing finished:', event.layer.toGeoJSON());
});


export { map };