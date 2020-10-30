var tracts = $.ajax({
    url: "data/Incidents_True_CensusTracts.geojson",
    dataType: "json",
    success: console.log("data successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
})
$.when(tracts).done(function() {
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
    var incidentsTracts = L.geoJSON(tracts.responseJSON).addTo(map);
});