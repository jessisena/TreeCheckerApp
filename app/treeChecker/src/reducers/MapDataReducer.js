// import { offlineActionTypes } from 'react-native-offline';
import {
  // REFRESH_OBSLIST,
  AOI_ID_SELECTED,
  OBS_SELECTED,
  ADD_OBS_AOI,
  UPDATE_OBS_AOI,
  SET_MAP_ACTION,
  REFRESH_CURRENT_AOI,
  OBS_SELECTED_BY_INDEX,
  SET_SYNC_STATUS,
  CHECK_STATE,
  UPDATE_CURRENTAOI_TOSYNC,
  UPDATE_INDEX_OBS_AOI,
  SET_LOADING_MAP,
  OBS_DELETE,
  OBS_DELETE_LOCAL
} from '../actions/types';

const INITIAL_STATE = {
  loadingMap: true,
  currentAoi: {},
  currentAoiId: '',
  currentObs: {},
  mapAction: { action: '' },
  serverStarted: false,
  server: {},
  synchronizing: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case REFRESH_OBSLIST:
    //   console.log('OBS_GET_SUCCESS');
    //   return { ...state, obsList: action.payload.obsList, currentAoiId: action.payload.currentAoiId };

    case CHECK_STATE:
      console.debug('CHECK_STATE currentAoi', state.currentAoi);
      return { ...state };

    case SET_SYNC_STATUS:
      return { ...state, synchronizing: action.payload };

    case SET_LOADING_MAP:
      return { ...state, loadingMap: action.payload };

    case REFRESH_CURRENT_AOI:
      return { ...state, currentAoi: action.payload, currentAoiId: action.payload.key };

    case SET_MAP_ACTION:
      return { ...state, mapAction: { action: action.payload.action, longitude: action.payload.longitude, latitude: action.payload.latitude } };

    case AOI_ID_SELECTED:
      return { ...state, currentAoiId: action.payload };

    case OBS_SELECTED:
      return { ...state, currentObs: action.payload };

    case OBS_SELECTED_BY_INDEX:
      return { ...state, currentObs: state.currentAoi.obs[action.payload] };

    case UPDATE_INDEX_OBS_AOI: {
    const { newKey, oldKey, tree_specie_key } = action.payload;
    const obs = { ...state.currentAoi.obs[oldKey] };
    console.debug('UPDATE_INDEX_OBS_AOI', obs);
    obs.key = newKey;
    obs.tree_specie.key = tree_specie_key;
    return { ...state,
            currentAoi: {
              ...state.currentAoi,
              obs: {
                ...state.currentAoi.obs,
                [newKey]: obs
              }
            }
          };
    }

    case OBS_DELETE: {
          const { key } = action.payload;
          const newObs = { ...state.currentAoi.obs };
          delete newObs[key];
          return { ...state,
                  currentAoi: {
                    ...state.currentAoi,
                    obs: newObs
                  }
                };
    }
    case OBS_DELETE_LOCAL: {
          const { key } = action.payload;
          const newObs = { ...state.currentAoi.obs };
          const deletedObs = { ...newObs[key], key: `deleted_${key}`, toSync: true };
          delete newObs[key];
          return { ...state,
                  currentAoi: {
                    ...state.currentAoi,
                    obs: {
                      ...newObs,
                      [`deleted_${key}`]: deletedObs
                    }
                  }
                };
    }
    case UPDATE_OBS_AOI:
      return { ...state,
              currentAoi: {
                ...state.currentAoi,
                obs: {
                  ...state.currentAoi.obs,
                  [action.payload]: state.currentObs
                }
              }
            };
    case UPDATE_CURRENTAOI_TOSYNC: {
      const { sobsKey, saoiId, sync, tree_specie } = action.payload;
      if (state.currentAoiId === saoiId) {
        return { ...state,
                currentAoi: {
                  ...state.currentAoi,
                  obs: {
                    ...state.currentAoi.obs,
                    [sobsKey]: {
                      ...state.currentAoi.obs[sobsKey],
                      tree_specie,
                      toSync: sync
                    }
                  }
                }
              };
      }
        return { ...state };
    }

    case ADD_OBS_AOI:
        console.debug('ADD_OBS_AOI', action.payload);
        return { ...state,
                currentAoi: {
                  ...state.currentAoi,
                  obs: {
                    ...state.currentAoi.obs,
                    [action.payload.key]: action.payload
                  }
                }
              };

    default:
      return state;
  }
};
