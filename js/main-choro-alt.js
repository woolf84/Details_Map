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
 
// Add requested external GeoJSON to map
    var tractsLayer = L.geoJSON(tracts.responseJSON).addTo(map);
    var incidentsLayer = L.geoJSON(incidentPoints.responseJSON).addTo(map);
    var detailLayer = L.geoJSON(detailPoints.responseJSON).addTo(map);

    var pointLayers = L.layerGroup([incidentsLayer, detailPoints]);

    var allLayers = {
        "Incidents and details": pointLayers,
        "Incidents by Neighborhood": tractsLayer
    };

    L.control.layers(allLayers, null, { collapsed: false }).addTo(map);
});