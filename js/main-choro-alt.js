var detailMarkerOptions = {
    radius : 4,
    fillColor : "##FF0000",
    color : "000",
    weight : 1, 
    opacity : 1,
    fillOpacity : .8
};

var incidentsMarkerOptions = {
    radius : 4,
    fillColor : "#0000ff",
    color : "000",
    weight : 1, 
    opacity : 1,
    fillOpacity : .8
};

var tracts = $.ajax({
    url: "data/Incidents_True_CensusTracts.geojson",
    dataType: "json",
    success: console.log("tracts successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

var incidentPoints = $.ajax({
    url: "data/incidents_true.geojson",
    dataType: "json",
    success: console.log("incident points successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

var detailPoints = $.ajax({
    url: "data/matching_details_subset.geojson",
    dataType: "json",
    success: console.log("details points successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(tracts, incidentPoints, detailPoints).done(function() {
    var map = L.map('map',{
		center: [42.350,-71.065],
		zoom: 14,
		minZoom:4,
		maxZoom: 21,
		zoomControl:false
    });

    var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 21,
		ext: 'png'
}).addTo(map);

function getColor(d) {
    return d > 191 ? '#800026' :
           d > 110  ? '#BD0026' :
           d > 54  ? '#E31A1C' :
           d > 33  ? '#FC4E2A' :
           d > 18   ? '#FD8D3C' :
           d > 7   ? '#FEB24C' :
                      '#FFEDA0';
};

function style(feature) {
    return {
        fillColor: getColor(feature.properties.NUMPOINTS),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}; 

function onEachTract(feature, layer) {
    layer.on(
        //{click: }
    );
};

// Add requested external GeoJSON to map
    var tractsLayer = L.geoJSON(tracts.responseJSON, {
        style: style
        //, onEachFeature: onEachTract
    }).addTo(map);
    var incidentsLayer = L.geoJSON(incidentPoints.responseJSON, {
        pointToLayer : function (feature, latlng) {
            return L.circleMarker(latlng, incidentsMarkerOptions);
        }
    }).addTo(map);
    var detailLayer = L.geoJSON(detailPoints.responseJSON, {
        pointToLayer : function (feature, latlng) {
            return L.circleMarker(latlng, detailMarkerOptions);
        }
    }).addTo(map);

    var pointLayers = L.layerGroup([incidentsLayer, detailPoints]);

    var allLayers = {
//        "Incidents and details": pointLayers,
        "Incidents": incidentsLayer,
        "Details": detailLayer,
        "Incidents by Neighborhood": tractsLayer
    };

    L.control.layers(allLayers, null, { collapsed: false }).addTo(map);
});