// Initialise all the LayerGroups that we'll use.
let layers = {
    eLayer: new L.LayerGroup(),
  };
  
  // Creating the map object
  let myMap = L.map("map", {
    center: [-7.814, 104.96332],
    zoom: 3,
    layers: [layers.eLayer],
  });
  
  // Adding the tile layer
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  // Add our "streetmap" tile layer to the map.
  streetmap.addTo(myMap);
  
  // Create an overlays object to add to the layer control.
  let overlays = {
    "Earthquakes": layers.eLayer,
  };
  
  // Create a control for our layers, and add our overlays to it.
  L.control.layers({ "Street Map": streetmap }, overlays).addTo(myMap);
  
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(response) {
    let earthquakes = response.features;
    console.log(earthquakes);
    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];

    function markerSize(magnitude) {
        if (magnitude < 0 || isNaN(magnitude)) {
          return 5; // return a default size if magnitude is not valid
        }
        return magnitude * 5;
    }
  
    // Loop through the earthquakes array.
    for (let index = 0; index < earthquakes.length; index++) {
      let earthquake = earthquakes[index];
  
      // For each earthquake, create a marker, and bind a popup with the magnitude and place.
      let earthquakeMarker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: "black",
            fillColor: "yellow",
            radius: markerSize(earthquake.properties.mag) // adjust the radius based on the magnitude of the earthquake
      }).bindPopup("<h3>" + earthquake.geometry.coordinates[2] + "</h3><h3>Place: " + earthquake.properties.place + "</h3> <h3> Mag: " + earthquake.properties.mag + "</h3>");
  
      // Add the marker to the earthquakeMarkers array.
      earthquakeMarkers.push(earthquakeMarker);
      
    }
    console.log(earthquakeMarkers);
    // Create a layer group made from the earthquake markers array, and add it to the map.
    let earthquakeLayer = L.layerGroup(earthquakeMarkers);
    earthquakeLayer.addTo(layers.eLayer);
  });

