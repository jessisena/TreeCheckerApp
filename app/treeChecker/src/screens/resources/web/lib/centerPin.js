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
	addMapEvents();

});

setTimeout(() => { sendDataToReact({ "webInit" : true }) }, 3000);

function receiveWebViewMessages(json) {

	if(json.pos) {

		mymap.setView([json.pos.latitude, json.pos.longitude], 17);

	}
	else if(json.urlOffline) {

		addOfflineLayers(json.urlOffline);
		
	}

};

function initLayers() {

	var osm = new L.TileLayer(LayerDefinitions.osm.url, {maxZoom: 19, attribution: LayerDefinitions.osm.attribution});
	mymap.addLayer(osm);

}

function addOfflineLayers(baseURL) {

	for(let layerName of LayerDefinitions.downloadables) {

		console.log("Adding " + layerName);
		var layer = new L.TileLayer(`${baseURL}/tiles/${layerName}/{z}/{x}/{y}.png`, {maxZoom: 17});
		mymap.addLayer(layer);

	}

}

function addMapEvents() {

	mymap.on('moveend', (e) => {

		sendDataToReact({"center": mymap.getCenter()})

	});

}
