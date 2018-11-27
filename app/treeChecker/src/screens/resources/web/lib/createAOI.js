import RNMessageChannel from 'react-native-webview-messaging';
import LayerDefinitions from '../../../../common/layerDefinitions.js';

RNMessageChannel.on('json', json => {

	receiveWebViewMessages(json);

});

function sendDataToReact(data) {

	RNMessageChannel.sendJSON(data);

};

var mymap = L.map('mapid');

mymap.on('load', (e) => {

	initLayers();

});

setTimeout(() => { sendDataToReact({ "webInit" : true }) }, 3000);

function receiveWebViewMessages(json) {

	if(json.bbox) {

		var corner1 = L.latLng(json.bbox[0], json.bbox[1]),
			corner2 = L.latLng(json.bbox[2], json.bbox[3]),
			bounds = L.latLngBounds(corner1, corner2);

		mymap.fitBounds(bounds);
		initAOIArea();

	}

};

function initLayers() {

	var osm = new L.TileLayer(LayerDefinitions.osm.url, {maxZoom: 19, attribution: LayerDefinitions.osm.attribution});
	mymap.addLayer(osm);

	var wmsLayer1 = L.tileLayer.wms(LayerDefinitions.testWMS.url, { layers: LayerDefinitions.testWMS.layers });
	mymap.addLayer(wmsLayer1);

}

function initAOIArea() {

	var locationFilter = new L.LocationFilter({enable:true, enableButton: false, adjustButton: false}).addTo(mymap);
	var bounds = locationFilter.getBounds();

	if(!checkArea(bounds)) {

		locationFilter.setStyle({fillColor: "red", "fillOpacity": 0.3});

	} else {

	}

	locationFilter.on("change", function (e) {
		
		var bounds = locationFilter.getBounds();
		if(!checkArea(bounds)) {

			locationFilter.setStyle({fillColor: "red", "fillOpacity": 0.3});
			sendDataToReact({"isValid": false});

		} else {

			locationFilter.setStyle({fillColor: "white"});
			sendDataToReact({"isValid": true, "bbox": bounds, "zoom": mymap.getZoom()})

		}

	});

}

function checkArea(bounds) {

	var limit = 15000000;

	var NW = bounds.getNorthWest();
	var NE = bounds.getNorthEast();
	var SW = bounds.getSouthWest();
	var SE = bounds.getSouthEast();

	var hDist = NW.distanceTo(NE);
	var vDist = NE.distanceTo(SE);

	var area = hDist*vDist;

	return area < limit;

}
