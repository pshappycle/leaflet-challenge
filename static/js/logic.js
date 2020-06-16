// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-06-08&endtime=" +
//   "2020-06-15&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}
function magnitude(mag){
  if (mag < 1){
    return mag*10000
  }
  else if (mag < 2){
    return mag*20000
  }
  else if (mag < 3){
    return mag*30000
  }
  else if (mag < 4){
    return mag*40000
  }
  else if (mag < 5){
    return mag*50000
  }
  else{
    return mag*60000
  }
}

function color(mag){
  if (mag < 1){
    return "#04ff00"
  }
  else if (mag < 2){
    return "#ccff00"
  }
  else if (mag < 3){
    return "#ffee00"
  }
  else if (mag < 4){
    return "#ffaa00"
  }
  else if (mag < 5){
    return "#ff4d00"
  }
  else{
    return "#ff0400"
  }
}

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latLng){
      return L.circle(latLng,{
        radius: magnitude(earthquakeData.properties.mag),
        fillColor: color(earthquakeData.properties.mag),
        color: "black",
        fillOpacity: 1,
        stroke:true,
        weight: 1,
        opacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  };

// var queryUrl2 =
//   d3.json

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  var outdoormap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/outdoors-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Gray Scale": grayscalemap,
    "Outdoor": outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    //FaultLine: faultLine
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.822, -122.43],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0, 1, 2, 3, 4, 5],
        labels = [];

        function color(d) {
          return d < 1 ? '#04ff00' :
                 d < 2  ? '#ccff00' :
                 d < 3  ? '#ffee00' :
                 d < 4  ? '#ffaa00' :
                 d < 5   ? '#ff4d00' :
                            '#ff0400';
      }

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}
