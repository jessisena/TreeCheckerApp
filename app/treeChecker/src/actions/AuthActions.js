
import axios from 'axios';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-native';
import { strings } from '../screens/strings.js';

import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT,
  UPDATE_TOKEN,
  REFRESHING_TOKEN,
  GEOZONES_FETCH_SUCCESS,
  SET_CANOPY_LIST,
  SET_CROWN_LIST,
  SET_TREE_SPECIES_LIST,
  ALL_AOIS_FETCH_SUCCESS,
  UPDATE_USER_DATA
} from './types';

import {
  URL_LOGIN,
  URL_CANOPIES,
  URL_CROWNS,
  URL_TREES,
  URL_GET_USER_DATA,
  URL_GZS,
  URL_STATIC,
  URL_STATIC_GZ,
  URL_AOI_SUFFIX
} from './urls';

export const usernameChanged = (text) => {
  return {
    type: USERNAME_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const logout = () => {
  return {
      type: LOGOUT,
      payload: ''
  }
}

export default function authMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (typeof action === 'function') {
      let state = getState();

      if(state) {
        if(state.network.isConnected && state.auth && isExpired(state.auth.token_timestamp)) {
            return refreshToken(dispatch, state).then(() => {
              next(action)
            }).catch( err => {
              const style = {
                backgroundColor: '#ddD32F2F',
                color: '#ffffff',
                fontSize: 15,
                borderWidth: 5,
                borderRadius: 80,
                fontWeight: 'bold'
              }
              const message = strings.errorRefreshingToken;
              Toast.show(message, Toast.LONG, Toast.BOTTOM, style);
            });
        }
      }
    }
    return next(action);
  }
}

function isExpired(expires_date) {
  let currentTime = Date.now();
  return (currentTime > expires_date) && expires_date !== -1;
}

function refreshToken(dispatch, state) {

  let refreshTokenPromise = axios.post(URL_LOGIN, {
    email: state.auth.username,
    password: state.auth.password
  }).then(resp => {
    dispatch({
      type: UPDATE_TOKEN,
      payload: {token: resp.data.token, token_timestamp: Date.now() }
    });

    return resp ? Promise.resolve(resp) : Promise.reject({
        message: 'could not refresh token'
    });
  }).catch(ex => {
    return Promise.reject({
        message: 'could not refresh token'
    });
  });

  return refreshTokenPromise;
}

export const loginUser = ({ username, password, navigation }) => {

  async function thunk(dispatch) {
      dispatch({ type: LOGIN_USER });
      const time = Date.now();
      try {
        let { data } = await axios.post(URL_LOGIN, {
          email: username,
          password
        });

        await prefetchData(data.token, dispatch);
        preFetchFormData(data.token, dispatch);
        preFetchUserData(username, data.token, dispatch);

        loginUserSuccess(dispatch, { username, password, token: data.token, token_timestamp: time  });

        navigation.navigate('walkthrough');
      } catch (error) {
        loginUserFail(dispatch);
      }
    };

    thunk.interceptInOffline = true;
    return thunk;
};

const prefetchData = async (token, dispatch) => {

  try {

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });
    let data = await instance.get(URL_GZS);
    const geozonesList = data.data;

    const allAoisList = {};

    await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/`);
    await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/gz/`);
    await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/obs/`);

    for (let gz of geozonesList) {
      try {
        let responseImages = await RNFS.downloadFile({
          fromUrl: `${URL_STATIC_GZ}${gz.key}.png`,
          toFile: `${RNFS.ExternalDirectoryPath}/pictures/gz/${gz.key}.png`
        });
      } catch(e) {/*TODO showToast*/}


        try {
          data = await instance.get(`${URL_GZS}${gz.key}${URL_AOI_SUFFIX}`);
          const list = data.data;
          let gzAoisList = {};
          for (let aoi of list ) {
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
                  } catch(e) {/*TODO showToast*/ }

                }
                o.images = imgList;
                o.toSync = false;
                obsList[o.key] = o;
            }
            aoi.obs = obsList;
            gzAoisList[aoi.key] = aoi;
          }
          allAoisList[gz.key] = gzAoisList;

        } catch (error) {
          allAoisList[gz.key] = [];
        }
    }

    dispatch({ type: GEOZONES_FETCH_SUCCESS, payload:geozonesList });
    dispatch({ type: ALL_AOIS_FETCH_SUCCESS, payload: allAoisList });
  } catch(e) {
    /*TODO showToast*/
  }
}

const preFetchFormData = async (token, dispatch) => {

  try {

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

    let response = await instance.get(URL_CANOPIES);
    let list = {};
    for(let item of response.data){
      list[item.key] = item;
    }
    dispatch({ type: SET_CANOPY_LIST, payload: list });

    response = await instance.get(URL_CROWNS);
    list = {};
    for(let item of response.data){
      list[item.key] = item;
    }
    dispatch({ type: SET_CROWN_LIST, payload: list });

    response = await instance.get(URL_TREES);
    list = {};
    for(let item of response.data){
      list[item.key] = item;
    }
    dispatch({ type: SET_TREE_SPECIES_LIST, payload: list });

  } catch(e) {
    /*TODO showToast*/
  }
}

const preFetchUserData = async (username, token, dispatch) => {

  let userData = {
    key: 1,
    name: username,
    username: username,
    email: 'email',
    occupation: '',
    country: {
        key: 1,
        country_code: 'en',
        name: ''
    },
    language: 'en'
  };

  try {

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

    let response = await instance.get(URL_GET_USER_DATA);
    if (response.status === 200) {
      userData = response.data;
    }
    dispatch({ type: UPDATE_USER_DATA, payload: userData });

  } catch(e) {
    /*TODO showToast*/
    dispatch({ type: UPDATE_USER_DATA, payload: userData });
  }
}

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, data) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: data
  });
};
