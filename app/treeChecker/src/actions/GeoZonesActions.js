
import { AsyncStorage } from 'react-native';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-toast-native';
import { strings } from '../screens/strings.js';
import LayerDefinitions from '../common/layerDefinitions.js';
import {
  GEOZONES_FETCH_SUCCESS,
  ALL_AOIS_FETCH_SUCCESS,
  LOADING_GEOZONES_DATA,
  AOI_LIST_FETCH_SUCCESS,
  GZ_SELECTED,
  LOADING_DATA,
  LOGIN_USER_SUCCESS,
  AOI_LIST_FETCH_ASYNC,
  UPDATE_PROGRESS,
  UPDATE_TOTAL,
  SET_DOWNLOAD_STATUS,
  SET_CANOPY_LIST,
  SET_CROWN_LIST,
  SET_TREE_SPECIES_LIST,
  UPDATE_TOKEN,
  CLEAR_FETCHED_IMAGES,
  AOI_MODAL_VISIBLE,
  RESET_STATE,
  AOI_DELETE,
  ADD_NEW_AOI
} from './types';

import {
  URL_LOGIN,
  URL_GZS,
  URL_AOI_SUFFIX,
  URL_API_AOIS,
  URL_STATIC
} from './urls';



export const gzUpdate = ( currentGz ) => {
  return {
    type: GZ_SELECTED,
    payload:  { id: currentGz.key, name: currentGz.name, bbox: currentGz.bbox}
  };
};

export const setAOIModalVisible = ( isVisible ) => {
  return {
    type: AOI_MODAL_VISIBLE,
    payload: isVisible
  };
};

export const resetState = () => {
  return {
    type: RESET_STATE,
    payload: ''
  };
};

export const resetDownload = () => async dispatch => {
  dispatch({ type: SET_DOWNLOAD_STATUS, payload: false });
  dispatch({ type: CLEAR_FETCHED_IMAGES, payload: false });
};

export const downloadTiles = ({ aoiName, bbox, zoomLevel, navigation, token, currentGzId }) => {

  async function thunk(dispatch) {

    var fetchQueue = getTileDownloadURLs(bbox, zoomLevel);
    const style = {
      backgroundColor: '#ddD32F2F',
      color: '#ffffff',
      fontSize: 15,
      borderWidth: 5,
      borderRadius: 80,
      fontWeight: 'bold'
    }
    dispatch({ type: UPDATE_TOTAL, payload: fetchQueue.length });
    dispatch({ type: SET_DOWNLOAD_STATUS, payload: true });

    for(var i=0, len=fetchQueue.length; i<len; ++i) {

      try {
        var data = fetchQueue[i];
        var url = data.url;
        var dirPath = `${RNFS.ExternalDirectoryPath}/tiles/${data.layerName}/${data.z}/${data.x}/`;
        var filePath = `${dirPath}${data.y}.png`;

        var exists = await RNFS.exists(dirPath);
        if(!exists) {
          await RNFS.mkdir(dirPath)
        }

        try {
          await RNFS.downloadFile({fromUrl: url, toFile: filePath}).promise;
          dispatch({ type: UPDATE_PROGRESS });
        } catch(error) {
          //console.log(url + " KO1 " + error)
          const message = strings.errordownloadtiles;
          Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
        }
      } catch (error) {
        //console.log("--------- ERR: " + error);
        const message = strings.errordownloadtiles;
        Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
      }

    }
    finishDownload(aoiName, bbox, navigation, token, currentGzId, dispatch);
    dispatch({ type: SET_DOWNLOAD_STATUS, payload: false });
    dispatch({ type: AOI_MODAL_VISIBLE, payload: false });
  };
  return thunk;
}

export const aoiListFetch = ({ token, currentGzId, allAoisList }) => {
  async function thunk(dispatch) {
      dispatch({ type: LOADING_DATA, payload: true });
      try {
        const instance = axios.create({
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type':'application/json'
          }
        });
        let response = await instance.get(`${URL_GZS}${currentGzId}${URL_AOI_SUFFIX}`);

        for (let aoi of response.data) {

          let newObsList = {};

          if (allAoisList[currentGzId][aoi.key]) {
            let storedAoiObs = allAoisList[currentGzId][aoi.key].obs;

            for (let o of aoi.obs) {
              if(storedAoiObs[o.key] && storedAoiObs[o.key].toSync){
                newObsList[o.key] = storedAoiObs[o.key];
              }else{
                  newObsList[o.key] = o;
              }
            }
            allAoisList[currentGzId][aoi.key].obs = newObsList;
          } else {
            let obsList = {};
            for(let o of aoi.obs){
              let imgList = {};
              for(let i of o.images){
                imgList[i.key] = i;

                try {
                  let respObsImage = await RNFS.downloadFile({
                    fromUrl: `${URL_STATIC}${i.url}`,
                    toFile: `${RNFS.ExternalDirectoryPath}/pictures${i.url}`
                  });
                } catch(e) {
                  console.debug('error rnfs download image obs', e);
                }

              }
              o.images = imgList;
              o.toSync = false;
              obsList[o.key] = o;
            }

            aoi.obs = obsList;
            allAoisList[currentGzId][aoi.key] = aoi;
          }
        }

        dispatch({ type: AOI_LIST_FETCH_SUCCESS, payload: allAoisList[currentGzId] });
        dispatch({ type: ALL_AOIS_FETCH_SUCCESS, payload: allAoisList });
        dispatch({ type: LOADING_DATA, payload: false });

      } catch (error) {
          dispatch({ type: AOI_LIST_FETCH_ASYNC, payload: currentGzId });
          dispatch({ type: LOADING_DATA, payload: false });
      }
    };

    thunk.interceptInOffline = true;
    return thunk;
};

export const geoZonesFetch = (token) => {

  return async (dispatch) => {

    dispatch({ type: LOADING_GEOZONES_DATA, payload: true });

    try {
        const instance = axios.create({
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type':'application/json'
        }
      });

      let data = await instance.get(URL_GZS);
      //TODO Comprar els dos, si hi ha algun de nou descarregar la foto, i portar les dades
      dispatch({ type: GEOZONES_FETCH_SUCCESS, payload: data.data });
      dispatch({ type: LOADING_GEOZONES_DATA, payload: false });
    } catch (error) {
      dispatch({ type: LOADING_GEOZONES_DATA, payload: false });
      const style = {
        backgroundColor: '#dd8BC34A',
        color: '#ffffff',
        fontSize: 15,
        borderWidth: 5,
        borderRadius: 80,
        fontWeight: 'bold',
        yOffset: 40
      }
      const message = strings.gznotrefreshed;
      Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
    }
  };
};

async function uploadAOI(token, gzId, name, bbox, dispatch) {

  try {
    const message = strings.uploadAOIerror;
    const style = {
      backgroundColor: '#dd8BC34A',
      color: '#ffffff',
      fontSize: 15,
      borderWidth: 5,
      borderRadius: 80,
      fontWeight: 'bold'
    }

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

    const url = `${URL_GZS}${gzId}${URL_AOI_SUFFIX}`;
    let response = await instance.post(url, {
      name: name,
      x_min: bbox._southWest.lng,
      y_min: bbox._southWest.lat,
      x_max: bbox._northEast.lng,
      y_max: bbox._northEast.lat,
    });

    if( response.status === 200 ){
      dispatch({ type: ADD_NEW_AOI, payload: {aoi: response.data} });
    } else {
      Toast.show(message, Toast.LONG, Toast.CENTER, style);
    }

  } catch(e) {
    Toast.show(message, Toast.LONG, Toast.CENTER, style);
  }
}

export const deleteAOI = ({token, key}) => {

  async function thunk(dispatch) {

    dispatch({ type: LOADING_DATA, payload: true });
     const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });
    try {
      const url = `${URL_API_AOIS}${key}/`;
      let response = await instance.delete(url);

      if(response.status === 200) {
        dispatch({ type: AOI_DELETE, payload: key });
      } else {
        const style = {
          backgroundColor: '#ddD32F2F',
          color: '#ffffff',
          fontSize: 15,
          borderWidth: 5,
          borderRadius: 80,
          fontWeight: 'bold'
        }
        const message = strings.aoinotdeleted;
        Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
      }
      dispatch({ type: LOADING_DATA, payload: false });

    } catch(e) {
      dispatch({ type: LOADING_DATA, payload: false });
    }
  };
  return thunk;
};


const lon2tile = (lon, zoom) => {
  return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
}

const lat2tile = (lat, zoom) => {
  return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}

const tile2long = (x, zoom) => {
  return (x/Math.pow(2,zoom)*360-180);
}

const tile2lat = (y, zoom) => {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,zoom);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

const getTileBbox = (x, y, zoom) => {
  const xMin = tile2long(x, zoom);
  const xMax = tile2long(x+1, zoom);
  const yMax = tile2lat(y, zoom);
  const yMin = tile2lat(y+1, zoom);

  return [xMin, yMin, xMax, yMax];
};

const getTileDownloadURLs = (bbox, zoomLevel) => {

  var maxZoom = 17;
  var fetchQueue = [];
  for(var zoom = zoomLevel; zoom <= maxZoom; ++zoom) {

    var xMin = lon2tile(bbox._southWest.lng, zoom);
    var xMax = lon2tile(bbox._northEast.lng, zoom);
    var yMin = lat2tile(bbox._northEast.lat, zoom);
    var yMax = lat2tile(bbox._southWest.lat, zoom);

    for(var x=xMin; x <= xMax; ++x) {
      for(var y=yMin; y <= yMax; ++y) {
        var tileBbox = getTileBbox(x, y, zoom).join(',')
        for(let layerName of LayerDefinitions.downloadables) {
          const layer = LayerDefinitions[layerName];
          const urlBase = layer.url;
          const wmsLayerName = layer.layers;
          const format = layer.format;
          const transparent = layer.transparent;
          const epsg = layer.crs;
          const version = layer.version;
          const width = layer.width;
          const height = layer.height;
          var wmsParams = `REQUEST=GetMap&VERSION=${version}&SERVICE=WMS&SRS=${epsg}&WIDTH=${width}&HEIGHT=${height}&LAYERS=${wmsLayerName}&STYLES=&FORMAT=${format}&TRANSPARENT=${transparent}&BBOX=${tileBbox}`;
          var url = `${urlBase}${wmsParams}`;

          fetchQueue.push({url: url, x: x, y: y, z: zoom, layerName: layerName});
        }
      }
    }
  }
  return fetchQueue;
};

async function finishDownload (aoiName, bbox, navigation, token, gzId, dispatch) {

  dispatch({ type: LOADING_DATA, payload: false });
  await uploadAOI(token, gzId, aoiName, bbox, dispatch);

  const backAction = NavigationActions.back({
    key: 'listaoi'
  })
  navigation.dispatch(backAction);
  navigation.goBack(null);
  dispatch({ type: LOADING_DATA, payload: false });
}
