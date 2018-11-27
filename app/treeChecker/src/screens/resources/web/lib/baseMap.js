import RNMessageChannel from 'react-native-webview-messaging';
import LayerDefinitions from '../../../../common/layerDefinitions.js';

RNMessageChannel.on('json', json => {

  receiveWebViewMessages(json);

});

function sendDataToReact(data) {

  console.log("Send data to React: " + JSON.stringify(data));
  RNMessageChannel.sendJSON(data);

};

var mymap = L.map('mapid');
var controlLayers = null;
var geojsonLayer = null;
var overlays = {};

mymap.on('load', (e) => {

  addMapEvents();
  addMapControls();
  initLayers();

});

setTimeout(() => { sendDataToReact({ action: "webInit" }) }, 3000);

function receiveWebViewMessages(json) {

  if(json.bbox) {

    var corner1 = L.latLng(json.bbox[0], json.bbox[1]),
      corner2 = L.latLng(json.bbox[2], json.bbox[3]),
      bounds = L.latLngBounds(corner1, corner2);

    mymap.fitBounds(bounds);

  }
  else if(json.latitude) {

    mymap.setView([json.latitude, json.longitude], 17);

  }

  if(json.obs) {

    addMarkers(json.obs);

  }

  if(json.url) {

    addOfflineLayers(json.url);

  }

};

//receiveWebViewMessages({bbox: [42.103886, 1.847184, 42.104607, 1.856271], obs: {"1":{"key":1,"name":"jess5","tree_specie":{"key":1,"name":"specie1"},"crown_diameter":{"key":5,"name":"0.5"},"canopy_status":{"key":1,"name":"status1"},"comment":"Comentari 111111","position":{"longitude":1.84832144377651,"latitude":42.1039590179281},"compass":35.378,"images":[{"key":13,"url":"/obs/EaJoC8JhyMyKcJCBrLkPAY4LT5SPNtEV.jpeg"},{"key":12,"url":"/obs/cF0zwAqillDeMFVyy2k97l7geJiNljvQ.jpeg"},{"key":11,"url":"/obs/y6WYpUk3Zb1J2tDCbltVKOWVno6XCAMD.jpeg"},{"key":10,"url":"/obs/nhzqE0dua7tGZMnZvuyOGNXzvDyLZRB1.jpeg"}]},"5":{"key":5,"name":"obsTest2","tree_specie":{"key":3,"name":"specie3"},"crown_diameter":{"key":5,"name":"0.5"},"canopy_status":{"key":3,"name":"status3"},"comment":"_This is a test from Postman_","position":{"longitude":40.654321,"latitude":1.72789},"compass":12,"images":[{"key":15,"url":"/obs/7OMgO8qcF1aOje68KhdYt3DSHqehWXM5.jpeg"},{"key":14,"url":"/obs/TIKJs86EEoLvboIW1DqimYckhfLKOWuY.jpeg"}]},"7":{"key":7,"name":"Tree XX","tree_specie":{"key":1,"name":"specie1"},"crown_diameter":{"key":1,"name":"0.1"},"canopy_status":{"key":1,"name":"status1"},"comment":"","position":{"longitude":2.23983764648438,"latitude":41.4787468886786},"compass":359,"images":[]},"8":{"key":8,"name":"Prova","tree_specie":{"key":1,"name":"specie1"},"crown_diameter":{"key":1,"name":"0.1"},"canopy_status":{"key":1,"name":"status1"},"comment":"","position":{"longitude":2.21923828125,"latitude":41.473602326344},"compass":359,"images":[]}}})

function initLayers() {

  var osm = new L.TileLayer(LayerDefinitions.osm.url, {maxZoom: 19, attribution: LayerDefinitions.osm.attribution});
  mymap.addLayer(osm);
  controlLayers.addBaseLayer(osm, LayerDefinitions.osm.layerName);

}

function addOfflineLayers(baseURL) {

  for(let layerName of LayerDefinitions.downloadables) {

    console.log("Adding " + layerName);
    var layer = new L.TileLayer(`${baseURL}/tiles/${layerName}/{z}/{x}/{y}.png`, {maxZoom: 17});
    
    mymap.addLayer(layer);

    if(controlLayers)
      controlLayers.addOverlay(layer, layerName);
    else
      overlays[layerName] = layer;

  }

}

function addMapEvents() {

  mymap.on('contextmenu', (e) => {

    sendDataToReact({

      action: 'addObservation',
      latitude: e.latlng.lat,
      longitude: e.latlng.lng

    });

  });

}

function addMapControls() {

  controlLayers = new L.control.layers({}, overlays, {sortLayers: true, hideSingleBase: true});
  controlLayers.addTo(mymap);

  L.control.locate().addTo(mymap);

  var comp = new L.Control.Compass({autoActive: true});
  mymap.addControl(comp);

}

function viewElement(id) {

  sendDataToReact({action: 'info', id: id});

}

function addMarkers(data) {

  const geojson = {

    "type": "FeatureCollection",
    "features": []

  };

  for(let index in data) {

    const point = data[index];
    const geojsonPoint = {

      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [point.position.longitude, point.position.latitude]
      },
      "properties": {
        "popup": buildSurveyDataPopup(point),
        "id": point.key
      }

    };

    geojson.features.push(geojsonPoint);

  }

  if(geojsonLayer != null) {

    controlLayers.removeLayer(geojsonLayer);
    mymap.removeLayer(geojsonLayer);

  }

  geojsonLayer = L.geoJSON(geojson, {

    pointToLayer: function (feature, latlng) {

      return L.marker(latlng);

    },
    onEachFeature: function (feature, layer) {

      layer.bindPopup(feature.properties.popup);

    }

  });
  
  geojsonLayer.addTo(mymap);
  controlLayers.addOverlay(geojsonLayer, 'Own data');

}

function buildSurveyDataPopup(data) {

  var container = L.DomUtil.create('div');
  container.innerHTML = `<h2>${data.name}</h2><p><b>Specie:</b>${data.tree_specie.name}</p><p><b>Diameter:</b>${data.crown_diameter.name}</p>`;
  var btn = L.DomUtil.create('i', 'fa fa-info-circle fa-2x centered', container);
  L.DomEvent.on(btn, 'click', () => {
    viewElement(data.key)
  });
  return container;

}
