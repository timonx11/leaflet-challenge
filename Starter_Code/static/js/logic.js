// Creating the map object
let myMap = L.map("map", {
    center: [-7.814, 104.96332],
    zoom: 3,
    layers: []
  });


// Adding the tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(myMap);


