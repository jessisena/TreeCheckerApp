const LayerDefinitions = {

	osm: {
		layerName: 'OSM',
		// url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		 url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
		attribution : 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	},
	testWMS : {
		url: 'http://ows.mundialis.de/services/service?',
		layers: 'TOPO-OSM-WMS',
		format: 'image/png',
		transparent: 'true',
		version: '1.1.0',
		height: 512,
		width: 512,
		crs: 'EPSG:4326',

	},
	testWMS2 : {
		url: 'http://ows.mundialis.de/services/service?',
		layers: 'OSM-WMS',
		format: 'image/png',
		transparent: 'true',
		version: '1.1.0',
		height: 512,
		width: 512,
		crs: 'EPSG:4326',

	},
	jrcOrtophotosWMS : {
		url: 'https://ies-ows.jrc.es.europa.eu/canhemonVI?',
		layers: 'pt.ortophotos.20151127',
		format: 'image/png',
		transparent: 'true',
		version: '1.1.0',
		height: 512,
		width: 512,
		crs: 'EPSG:4326',
	},
	jrcGeometriesWMS : {
		url: 'https://ies-ows.jrc.es.europa.eu/canhemonVI?',
		layers: 'pt.centroid_polygons.20151127',
		format: 'image/png',
		transparent: 'true',
		version: '1.1.0',
		height: 512,
		width: 512,
		crs: 'EPSG:4326',
	},
	downloadables: ['testWMS', 'testWMS2']

}

module.exports = LayerDefinitions;
