// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  console.log(data);
});

//Create markerSize function to determine the size of the cricle marker base on magnitude(feature.properties.mag)
function markerSize(magnitude) {
    return magnitude * 4;
}

// Change marker color based on depth
function markerColor(depth) {
  if (depth > 90) {
      return '#4d0099'
  } else if (depth > 70) {
    return '#ac00e6'
  } else if (depth > 50) {
    return '#ff3399'
  } else if (depth > 30) {
    return '#ff9999'
  } else if (depth > 10) {
    return '#ffcc99'
  } else {
    return '#ffe6cc'
  }
}

// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.87,
        opacity: 0.7,
        fillOpacity: 0.75
    });
}

// Define a function that we want to run once for each feature in the features array.
function createFeatures(earthquakeData) {
  // Give each feature a popup that describes the place and time of the earthquake.
  function popUp(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p><h4>Timestamp: </h4>${new Date(feature.properties.time)}</p><hr><p><b>Magnitude: </b>${feature.properties.mag} <br> <b>Depth: </b>${feature.geometry.coordinates[2]} </p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: popUp,
    pointToLayer: createMarker
    
  }); 

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
        -7.814, 104.96332
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

// Set up the legend.
let legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = []

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += 
                '<grade style="background:' + markerColor(grades[i] + 1) + '"></grade> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;

    };

        // Add legend to map
    legend.addTo(myMap);

}
