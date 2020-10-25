// declare map in global scope
var historicalDataMap;
var detAndInc = L.layerGroup();

//chloropleth hover function
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

function resetHighlight(e) {
    geojson.resetStyle(e.target);
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

function getColor(d) {
    return d > 513  ? '#BD0026' :
           d > 318  ? '#E31A1C' :
           d > 184  ? '#FC4E2A' :
           d > 73   ? '#FD8D3C' :
           d > 32   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
};

//instantiate map 
function createMap(){
	 historicalDataMap = L.map('map',{
		center: [42.350,-71.065],
		zoom: 14,
		minZoom:4,
		maxZoom: 21,
		zoomControl:false
	});

	//call getdata function
	getData(historicalDataMap);
	historicalDataMap.addControl( L.control.zoom({position: 'bottomright'}) )
};


//function to retrieve map data and place it on the map
function getData(map){
	//baselayer
	var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 21,
		ext: 'png'
}).addTo(historicalDataMap);



//part that gets the school data
 $.ajax("data/incidents_true.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

		 var incidentsMarkerOptions = {
			radius : 4,
			fillColor : "#0000ff",
			color : "000",
			weight : 1, 
			opacity : 1,
			fillOpacity : .8
		};

		//function for popup
		function buildPopupContent(datapoints,feature){
			// I have this stuff commented out because your data is ... XML? 
			// But if the features were formatted as GeoJSON, you could use this syntax to grab properties
			street = feature.feature.properties.STREET;
			offense = feature.feature.properties.OFFENSE_DESCRIPTION;
			when = feature.feature.properties.OCCURRED_ON_DATE;
			content = "<strong>Incident: </strong>" + offense + "<br>" + "<strong>Time and date: </strong>" + when + "<br>" + "<strong>Street: </strong>" + street;
			//content = "<strong>Name: </strong>" + name + "<br>" + "<strong>Address: </strong>" + address + "<br>" + "<strong>School type: </strong>" + type;
			feature.bindPopup(content);
		}

		//add geojson layer to map w/ unique symbology
		var incidentsLayer = L.geoJSON(datapoints, {
			onEachFeature: buildPopupContent,
			pointToLayer : function (feature, latlng) {
				return L.circleMarker(latlng, incidentsMarkerOptions);
			}
        });
        
        detAndInc.addLayer(incidentsLayer);


// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});

//part that gets the school data
$.ajax("data/matching_details_subset.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

		 var detailMarkerOptions = {
			radius : 4,
			fillColor : "##FF0000",
			color : "000",
			weight : 1, 
			opacity : 1,
			fillOpacity : .8
		};

		//function for popup
		function buildPopupContent(datapoints,feature){
			// I have this stuff commented out because your data is ... XML? 
			// But if the features were formatted as GeoJSON, you could use this syntax to grab properties
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
			//content = "<strong>Name: </strong>" + name + "<br>" + "<strong>Address: </strong>" + address + "<br>" + "<strong>School type: </strong>" + type;
			feature.bindPopup(content);
		}

		//add geojson layer to map w/ unique symbology
		var detailLayer = L.geoJSON(datapoints, {
			onEachFeature: buildPopupContent,
			pointToLayer : function (feature, latlng) {
				return L.circleMarker(latlng, detailMarkerOptions);
			}
        });
        
        detAndInc.addLayer(detailLayer);


// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});

//part that gets the school data
$.ajax("data/neighborhood_incidents.geojson",{
	dataType: "json",
	 success: function(response){
        var vectors = response.features;
        
        function buildPopupContent(datapoints,feature){
            details = feature.feature.properties.NUMPOINTS;
            name = feature.feature.properties.Name;
            content = "<strong>Name: </strong>" + name + "<br>" + "<strong>Number of details: </strong>" + details;
            feature.bindPopup(content);
        }

		//function for neighborhoods
		function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: buildPopupContent
            });
        }

		//add geojson layer to map w/ unique symbology
		var choroLayer = L.geoJSON(vectors, {
            style: style,
			onEachFeature: onEachFeature
        }).addTo(map);
        
        var dataLayers = {
            "Incidents and details": detAndInc,
            "Incidents by Neighborhood": choroLayer
        };
        
        L.control.layers(dataLayers, null, { collapsed: false }).addTo(map);


// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});

//bracket that closes out the getData() function. Don't erase!
};


$(document).ready(createMap);
