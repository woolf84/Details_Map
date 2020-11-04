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
        opacity: .7,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}; 

function onEachTract(feature, layer) {
    layer.bindPopup("<strong>Incidents within .1 km of a detail</strong>: " + feature.properties.NUMPOINTS);
};

//function for popup
function buildDetailPopup(datapoints,feature){
	street = feature.feature.properties.address;
	officer = feature.feature.properties.Emp_Name;
	company = feature.feature.properties.Customer_Name;
	start = feature.feature.properties.START_DATETIME;
	end = feature.feature.properties.END_DATETIME;
	paid = feature.feature.properties.Pay_Amount;
	worked = feature.feature.properties.Minutes_Worked;
	content = "<strong>Company: </strong>" + company + "<br>" + "<strong>Start Time and date: </strong>" + start + 
	"<br>" + "<strong>End Time and date: </strong>" + end + 
	"<br>" + "<strong>Location: </strong>" + street + 
	"<br>" + "<strong>Officer: </strong>" + officer +
	"<br>" + "<strong>Amount paid: </strong>" + paid +
	"<br>" + "<strong>Minutes worked: </strong>" + worked;
	feature.bindPopup(content);
};

function buildIncidentPopup(datapoints,feature){
	street = feature.feature.properties.STREET;
	offense = feature.feature.properties.OFFENSE_DESCRIPTION;
	when = feature.feature.properties.OCCURRED_ON_DATE;
    content = "<strong>Incident: </strong>" + offense + "<br>" + "<strong>Time and date: </strong>" + when + "<br>" + "<strong>Street: </strong>" + street;
    feature.bindPopup(content);
};

// Add requested external GeoJSON to map
    var tractsLayer = L.geoJSON(tracts.responseJSON, {
        style: style, 
        onEachFeature: onEachTract
    }).addTo(map);
    var incidentsLayer = L.geoJSON(incidentPoints.responseJSON, {
        onEachFeature: buildIncidentPopup,
        pointToLayer : function (feature, latlng) {
            return L.circleMarker(latlng, incidentsMarkerOptions);
        }
    });
    var detailLayer = L.geoJSON(detailPoints.responseJSON, {
        onEachFeature: buildDetailPopup,
        pointToLayer : function (feature, latlng) {
            return L.circleMarker(latlng, detailMarkerOptions);
        }
    });

    var pointLayers = L.layerGroup([incidentsLayer, detailPoints]);

    var overLayers = {
        "Incidents near a detail": incidentsLayer,
        "Details subset": detailLayer
    };

    var choroLayers = {
        "Regular Map" : basemap,
        "Incidents near a detail, by Neighborhood": tractsLayer
    }
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 7, 18, 33, 54, 110, 191],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
        };

    legend.addTo(map);
    L.control.layers(choroLayers, overLayers, { collapsed: false }).addTo(map);
});