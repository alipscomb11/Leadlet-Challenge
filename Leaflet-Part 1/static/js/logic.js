// Store JSON in a variable
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


//Read in data and pass to function
d3.json(url).then(data => {

    console.log(data);

    createFeatures(data.features);
});

// Set marker size and color
function markerSize(magnitude)  {
    return magnitude * 3;
};

function markerColor(depth)  {
    return depth > 500 ? '#800026' :
           depth > 400 ? '#800026' :
           depth > 300 ? '#E31A1C' :
           depth > 200 ? '#FC4E2A' :
           depth > 100 ? '#FD8D3C' :
                     '#FFEDA0';
}

//Function to create features
function createFeatures(earthquakeData){

    //Create two functions to configure geoJSON layer

    //Function to bind pop up for each feature
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p>`);
}

//Create markers and their properties for each feature
function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]), 
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
}

//Create a GeoJSON layer that contains the feature array
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer

});

//Send the earthquake layer to the createMap function 
createMap(earthquakes);



//createMap Function
function createMap(earthquakes) {

    //Create base layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | <a href="https://opentopomap.org">OpenTopoMap</a> <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>'
    });

    // Create the map with the streetmap and earthquake layers
    let myMap = L.map("map", {
        center: [
            0, 0
        ],
        zoom: 2,
        layers: [topo, earthquakes]
    });

    //Create a legend
    var legend = L.control({position: 'bottomright'});


    legend.onAdd = function () {
        var div = L.DomUtil.create('div', "legend"),
        depths = [0, 100, 200, 300, 400, 500];

        div.innerHTML = '<strong>Depth (km)</strong><br>';
        for (var i=0; i < depths.length; i++) {
            div.innerHTML +=
                '<div class="label"><i style="background:' + markerColor(depths[i] + 1) + '"></i>' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+') + '</div>';
        }
        return div;
    };

    legend.addTo(myMap);

}


}
