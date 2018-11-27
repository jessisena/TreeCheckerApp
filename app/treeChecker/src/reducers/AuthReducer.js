import { offlineActionTypes } from 'react-native-offline';
import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT,
  UPDATE_TOKEN,
  UPDATE_USER_DATA
} from '../actions/types';

const INITIAL_STATE = {
  password: null,
  username: null,
  token: -1,
  token_timestamp: -1,
  refreshing_token: false,
  error: '',
  loading: false,
  userData: {
    key: 1,
    name: 'User',
    username: 'user',
    email: 'email@email.com',
    occupation: 'Developer',
    country: {
        key: 1,
        code: 'en',
        name: 'barcelona'
    },
    language: 'en'
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case USERNAME_CHANGED:
      return { ...state, username: action.payload };

    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };

    case UPDATE_TOKEN:
      return { ...state, token: action.payload.token, token_timestamp: (action.payload.token_timestamp + 3600000) };

    case LOGIN_USER:
      return { ...state, loading: true, error: '' };

    case LOGOUT:
      return { ...INITIAL_STATE };

    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, username: action.payload.username, password: action.payload.password, token: action.payload.token, token_timestamp: (action.payload.token_timestamp + 3600000) };

    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed.', loading: false };

    case UPDATE_USER_DATA:
      return { ...state, userData: action.payload };

    case offlineActionTypes.FETCH_OFFLINE_MODE:
      return { ...state, error: 'No connection.', loading: false };

    default:
      return state;
  }
};
