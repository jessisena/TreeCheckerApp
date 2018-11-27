import axios from 'axios';
import RNFS from 'react-native-fs';
import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-toast-native';
import { strings } from '../screens/strings.js';

import {
  REFRESH_CURRENT_AOI,
  AOI_ID_SELECTED,
  OBS_SELECTED,
  SET_MAP_ACTION,
  OBS_UPDATE,
  OBS_CREATE,
  ADD_NEW_OBS,
  ADD_OBS_AOI,
  SET_SAVING_STATUS,
  SET_SYNC_STATUS,
  SET_LOADING_MAP,
  CHECK_STATE,
  UPDATE_OBS_IMAGES,
  UPDATE_OBS_TOSYNC,
  OBS_SAVE_SUCCESS,
  OBS_DELETE,
  OBS_DELETE_LOCAL,
  UPDATE_INDEX_OBS,
  UPDATE_INDEX_OBS_AOI,
  OBS_DELETE_AOI,
  OBS_SELECTED_BY_INDEX,
  UPDATE_OBS_AOI,
  UPDATE_OBS_ALLAOI,
  UPDATE_CURRENTAOI_TOSYNC,
  ADD_NEW_TREE_SPECIE,
  REMOVE_TREE_SPECIE,
} from './types';

import {
  URL_UPLOAD_IMG,
  URL_UPDATE_OBS,
  URL_ADD_IMAGE,
  URL_API_AOIS
} from './urls';


export const setLoadingMap = ( isLoading ) => {
  return {
    type: SET_LOADING_MAP,
    payload: isLoading
  };
};

export const addNewTreeSpecie = (item) => {
  return {
    type: ADD_NEW_TREE_SPECIE,
    payload: item
  };
};

export const setMapAction = ({ action, longitude, latitude }) => {
  return {
    type: SET_MAP_ACTION,
    payload: { action, longitude, latitude }
  };
};

export const aoiIdUpdate = ({ currentAoiId }) => {
  console.log(`currentAoiId ${currentAoiId}`);
  return {
    type: AOI_ID_SELECTED,
    payload: currentAoiId
  };
};

export const refreshSelectedObs = ( currentObs ) => {
  console.debug('refreshSelectedObs', currentObs);
  return {
    type: OBS_SELECTED,
    payload: currentObs
  };
};

export const refreshSelectedAoi = ( currentAoi ) => {
  console.debug('refreshSelectedAoi', currentAoi);
  return {
    type: REFRESH_CURRENT_AOI,
    payload: currentAoi
  };
};

export const refreshSelectedAoiByIndex = ( index ) => {
  return {
    type: OBS_SELECTED_BY_INDEX,
    payload: index
  };
};

export const obsUpdate = ({ prop, value }) => {
  return {
    type: OBS_UPDATE,
    payload: { prop, value }
  };
};

export const obsCreate = (pos, numObs) => {
  return {
    type: OBS_CREATE,
    payload: {pos, numObs}
  };
};

async function uploadImage(token, img, obsKey, latitude, longitude) {

  const instance = axios.create({
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type':'application/json'
    }
  });

    let contents = await RNFS.readFile(img.url, 'base64');
    let { data } = await instance.post(URL_UPLOAD_IMG, {
      image: `data:image/${img.type};base64,${contents}` //img.data
    });

    let response = await instance.post(URL_ADD_IMAGE, {
      survey_data: obsKey,
      latitude: latitude,
      longitude: longitude,
      compass: img.compass,
      url: data.url
    });

    let wr = await RNFS.writeFile(`${RNFS.ExternalDirectoryPath}/pictures${data.url}`, contents, 'base64');
    return ({
      key: response.data.key,
      url: data.url
    });

}

async function updateImages(dispatch, token, obsKey, aoiId, gzId, images, position) {

  try {
    const newImageList = [];
    let newImage = {};
    const newImgKeys = [];

    for (let img of images) {
      if (img.compass) {
        newImage = await uploadImage(token, img, obsKey, position.latitude, position.longitude);
        newImageList.push(newImage);
        newImgKeys.push(newImage.key);
      }else{
        newImageList.push(img);
        newImgKeys.push(img.key);
      }
    }
    dispatch({ type: UPDATE_OBS_IMAGES, payload: {obsKey, image_aoiId: aoiId, gzId, newImageList: newImageList} });
    return {success: true, newImgKeys};
  }catch(error) {
    console.debug('error:', error);
    return {success: false, newImgKeys: []};
  }
}

async function updateData(token, obsKey, name, tree_specie, crown_diameter, canopy_status, comment, position, compass, images) {

  try {
    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

      var newData = {
          name: name,
          tree_specie: (tree_specie.key.toString().startsWith('new_') ? tree_specie.name : tree_specie.key),
          crown_diameter: crown_diameter.key,
          canopy_status: canopy_status.key,
          comment: comment,
          longitude: position.longitude,
          latitude: position.latitude,
          compass: compass
      }
      if(images.success){
        newData.images = images.newImgKeys;
      }

      let response = await instance.put(`${URL_UPDATE_OBS}${obsKey}/`, newData);

      if (response.status == 200 ) {
        return {success: true, data: response.data};
      }

      return {success: false, data: {}};

  } catch(error) {
    return false;
  }

}

export const obsUpdateSaveServer = ( currentObsKey, currentAoiId, currentGzId, name, tree_specie, crown_diameter, canopy_status, comment, position, images, compass, token, fromListDataScreen ) => {

  async function thunk(dispatch) {

    if ( fromListDataScreen ) dispatch({ type: SET_SYNC_STATUS, payload: true });
    let new_tree_specie = { ...tree_specie };

    try {
      let successImages = await updateImages(dispatch, token, currentObsKey, currentAoiId, currentGzId, images, position);
      let successData = await updateData(token, currentObsKey, name, tree_specie, crown_diameter, canopy_status, comment, position, compass, successImages);
      const sync = (successData.success && successImages.success ? false : true);

      if(successData.success && tree_specie.key.toString().startsWith('new_')){
        dispatch({ type: ADD_NEW_TREE_SPECIE, payload: {key: successData.data.tree_specie, name: tree_specie.name} });
        dispatch({ type: REMOVE_TREE_SPECIE, payload: tree_specie.key });
        new_tree_specie.key = successData.data.tree_specie;
      }
      //TODO Buscar i actualitzar la resta d'obs que tenien aquesta tree specie

      dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sgzId: currentGzId, sync, tree_specie: new_tree_specie } });
      dispatch({ type: UPDATE_CURRENTAOI_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sync, tree_specie: new_tree_specie} });

      if ( fromListDataScreen ) {
        dispatch({ type: SET_SYNC_STATUS, payload: false });
      } else {
        const style = {
          backgroundColor: '#dd8BC34A',
          color: '#ffffff',
          fontSize: 15,
          borderWidth: 5,
          borderRadius: 80,
          fontWeight: 'bold',
          yOffset: 40
        }
        const message = `"${name}" ${strings.obshasbeensync}`;
        Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
      }
    } catch(e) {
      dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sgzId: currentGzId, sync: true, tree_specie: new_tree_specie} });
      dispatch({ type: UPDATE_CURRENTAOI_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sync: true, tree_specie: new_tree_specie} });
      if ( fromListDataScreen ) dispatch({ type: SET_SYNC_STATUS, payload: false });
      const style = {
        backgroundColor: '#ddD32F2F',
        color: '#ffffff',
        fontSize: 15,
        borderWidth: 5,
        borderRadius: 80,
        fontWeight: 'bold',
        yOffset: 40
      }
      const message = `"${name}" ${strings.obshasnotbeensync}`;
      Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
    }
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true,
    dismiss: []
  }
  return thunk;
};

export const obsUpdateSaveLocal = ( currentObs, currentAoiId, name, tree_specie, crown_diameter, canopy_status, comment, position, images ) => {

  async function thunk(dispatch) {
    dispatch({ type: SET_SAVING_STATUS, payload: true });
    const updatedObs = { ...currentObs };

    updatedObs.name = name;
    updatedObs.tree_specie = tree_specie;
    updatedObs.crown_diameter = crown_diameter;
    updatedObs.canopy_status = canopy_status;
    updatedObs.comment = comment;
    updatedObs.position.latitude = position.latitude;
    updatedObs.position.longitude = position.longitude;
    updatedObs.images = images;
    updatedObs.toSync = true;

    dispatch({ type: OBS_SELECTED, payload: updatedObs });
    dispatch({ type: UPDATE_OBS_AOI, payload: updatedObs.key });
    dispatch({ type: UPDATE_OBS_ALLAOI, payload: { updatedObs, currentAoiId} });
    dispatch({ type: SET_SAVING_STATUS, payload: false });
  };
  return thunk;
};

async function addData(token, currentAoiId, name, tree_specie, crown_diameter, canopy_status, comment, position, compass) {

  try {
    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

      var newData = {
          name: name,
          tree_specie: (tree_specie.key.toString().startsWith('new_') ? tree_specie.name : tree_specie.key),
          crown_diameter: crown_diameter.key,
          canopy_status: canopy_status.key,
          comment: comment,
          longitude: position.longitude,
          latitude: position.latitude,
          compass: compass
      }

      let response = await instance.post(`${URL_API_AOIS}${currentAoiId}/observations/`, newData);
      if (response.status === 200 ) return {success: true, obsKey: response.data.key, tree_specie_key: response.data.tree_specie };
      else return {success: false, obsKey: ''};

  } catch(error) {
    return false;
  }

}

export const obsCreateSaveServer = ( currentObsKey, currentAoiId, currentGzId, name, tree_specie, crown_diameter, canopy_status, comment, position, images, compass, token, fromListDataScreen ) => {

  async function thunk(dispatch) {

    if ( fromListDataScreen ) dispatch({ type: SET_SYNC_STATUS, payload: true });
    let new_tree_specie = { ...tree_specie };

    try {

      let successData = await addData(token, currentAoiId, name, tree_specie, crown_diameter, canopy_status, comment, position, compass);

      if(successData.success){

        if(tree_specie.key.toString().startsWith('new_')){
          dispatch({ type: ADD_NEW_TREE_SPECIE, payload: {key: successData.tree_specie_key, name: tree_specie.name} });
          dispatch({ type: REMOVE_TREE_SPECIE, payload: tree_specie.key });
          new_tree_specie.key = successData.tree_specie_key;
        }

        dispatch({ type: UPDATE_INDEX_OBS, payload: { newKey: successData.obsKey, oldKey: currentObsKey, aoiId: currentAoiId, tree_specie_key: new_tree_specie.key } });
        dispatch({ type: UPDATE_INDEX_OBS_AOI, payload: { newKey: successData.obsKey, oldKey: currentObsKey, tree_specie_key: new_tree_specie.key } });
        dispatch({ type: OBS_DELETE, payload: { key: currentObsKey, currentAoiId, currentGzId} });
        let successImgages = await updateImages(dispatch, token, successData.obsKey, currentAoiId, currentGzId, images, position);

        if(successImgages.success){
            dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: successData.obsKey, saoiId: currentAoiId, sgzId: currentGzId, sync: false, tree_specie: new_tree_specie} });
            dispatch({ type: UPDATE_CURRENTAOI_TOSYNC, payload: {sobsKey: successData.obsKey, saoiId: currentAoiId, sync: false, tree_specie: new_tree_specie } });
            if ( fromListDataScreen ) {
              dispatch({ type: SET_SYNC_STATUS, payload: false });
            } else {
              const style = {
                backgroundColor: '#dd8BC34A',
                color: '#ffffff',
                fontSize: 15,
                borderWidth: 5,
                borderRadius: 80,
                fontWeight: 'bold',
                yOffset: 40
              }
              const message = `"${name}" ${strings.obshasbeensync}`;
              Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
            }
        }
      }
    } catch(e) {
      console.debug(e);
      dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sgzId: currentGzId, sync: true, tree_specie: new_tree_specie} });
      dispatch({ type: UPDATE_CURRENTAOI_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sync: true, tree_specie: new_tree_specie } });
      if ( fromListDataScreen ) dispatch({ type: SET_SYNC_STATUS, payload: false });
    }
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true,
    dismiss: []
  }
  return thunk;
};

export const obsCreateSaveLocal = ( obsKey, name, tree_specie, crown_diameter, canopy_status, comment, position, images, compass, currentAoiId ) => {

  async function thunk(dispatch) {

    dispatch({ type: SET_SAVING_STATUS, payload: true });

    const newObs = {};
    newObs.key = obsKey;
    newObs.name = name;
    newObs.tree_specie = tree_specie;
    newObs.crown_diameter = crown_diameter;
    newObs.canopy_status = canopy_status;
    newObs.comment = comment;
    newObs.position = position;
    newObs.images = images;
    newObs.compass = compass;
    newObs.toSync = true;

    dispatch({ type: ADD_NEW_OBS, payload: {newObs, currentAoiId} });
    dispatch({ type: ADD_OBS_AOI, payload: newObs });
    dispatch({ type: SET_SAVING_STATUS, payload: false });

  };
  return thunk;
};

export const deleteObsServer = ( deleted_obsKey, name, currentAoiId, currentGzId, token, fromListDataScreen ) => {

  async function thunk(dispatch) {

    if ( fromListDataScreen ) dispatch({ type: SET_SYNC_STATUS, payload: true });

    try {
      const instance = axios.create({
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type':'application/json'
        }
      });
      const obsKey = deleted_obsKey.replace('deleted_', '');
      let response = await instance.delete(`${URL_UPDATE_OBS}${obsKey}/`);

      if (response.status === 200 ){
        dispatch({
          type: OBS_DELETE,
          payload: { key: deleted_obsKey, currentAoiId, currentGzId, currentGzId}
        });
        if ( fromListDataScreen ) {
          dispatch({ type: SET_SYNC_STATUS, payload: false });
        } else {
          const style = {
            backgroundColor: '#dd8BC34A',
            color: '#ffffff',
            fontSize: 15,
            borderWidth: 5,
            borderRadius: 80,
            fontWeight: 'bold',
            yOffset: 40
          }
          const message = `"${name}" ${strings.obshasbeendeleted}`;
          Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
        }
      };
    } catch(e) {
      if ( fromListDataScreen ) dispatch({ type: SET_SYNC_STATUS, payload: false });
      const style = {
        backgroundColor: '#ddD32F2F',
        color: '#ffffff',
        fontSize: 15,
        borderWidth: 5,
        borderRadius: 80,
        fontWeight: 'bold',
        yOffset: 40
      }
      const message = `"${name}" ${strings.obshasnotbeendeleted}`;
      Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
    }
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true,
    dismiss: []
  }
  return thunk;
};

export const deleteObsLocal = ( obsKey, currentAoiId ) => {

  async function thunk(dispatch) {
  dispatch({ type: SET_SAVING_STATUS, payload: true });

  dispatch({
    type: OBS_DELETE_LOCAL,
    payload: { key: obsKey, currentAoiId}
  });
  dispatch({ type: SET_SAVING_STATUS, payload: false });
  };
  return thunk;
};
