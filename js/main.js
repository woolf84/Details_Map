// declare map in global scope
var historicalDataMap;

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
		}).addTo(map);


// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});

//part that gets the school data
$.ajax("data/matching_details_subset_TRUE.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

		 var incidentsMarkerOptions = {
			radius : 4,
			fillColor : "#FFFF00",
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
		}).addTo(map);


// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});

//bracket that closes out the getData() function. Don't erase!
};


$(document).ready(createMap);
