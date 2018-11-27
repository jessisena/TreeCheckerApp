import { offlineActionTypes } from 'react-native-offline';
import {
  GEOZONES_FETCH_SUCCESS,
  ALL_AOIS_FETCH_SUCCESS,
  LOADING_GEOZONES_DATA,
  LOADING_DATA,
  AOI_LIST_FETCH_SUCCESS,
  GZ_SELECTED,
  AOI_LIST_FETCH_ASYNC,
  UPDATE_PROGRESS,
  UPDATE_TOTAL,
  SET_DOWNLOAD_STATUS,
  CHECK_STATE,
  RESET_STATE,
  UPDATE_OBS_IMAGES,
  UPDATE_OBS_TOSYNC,
  CLEAR_FETCHED_IMAGES,
  ADD_NEW_OBS,
  OBS_DELETE,
  OBS_DELETE_LOCAL,
  UPDATE_INDEX_OBS,
  AOI_MODAL_VISIBLE,
  AOI_DELETE,
  UPDATE_OBS_ALLAOI,
  ADD_NEW_AOI
} from '../actions/types';

const INITIAL_STATE = {
  loading: true,
  geozonesList: {},
  allAoisList: {},
  currentGzId: '',
  currentGZName: '',
  currentGZBbox: {},
  fetchedImages: 0,
  fetchImagesProgress: 0.0,
  fetchImagesTotal: 0,
  isDownloading: false,
  currentAoiList: {},
  createAOIModalVisible: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case CHECK_STATE:
      console.debug('CHECK_STATE allAoisList', state.allAoisList);
      return { ...state };

    case RESET_STATE:
      return { ...INITIAL_STATE };

    case GEOZONES_FETCH_SUCCESS:
      return { ...state, geozonesList: action.payload };

    case AOI_LIST_FETCH_SUCCESS:
      return { ...state, currentAoiList: action.payload, loading: false };

    case ALL_AOIS_FETCH_SUCCESS:
      return { ...state, allAoisList: action.payload };

    case GZ_SELECTED:
      return { ...state, currentGzId: action.payload.id, currentGZName: action.payload.name, currentGZBbox: action.payload.bbox };

    case LOADING_GEOZONES_DATA:
      return { ...state, loading: action.payload };

    case LOADING_DATA:
      return { ...state, loading: action.payload };

    case AOI_LIST_FETCH_ASYNC:
      return { ...state, loading: false, currentAoiList: state.allAoisList[action.payload] };

    case UPDATE_PROGRESS:
      return { ...state, fetchedImages: state.fetchedImages+1, fetchImagesProgress: (state.fetchedImages/state.fetchImagesTotal)};

    case UPDATE_TOTAL:
      return { ...state, fetchImagesTotal: action.payload};

    case SET_DOWNLOAD_STATUS:
      return { ...state, isDownloading: action.payload};

    case UPDATE_INDEX_OBS: {
    const { newKey, oldKey, aoiId, tree_specie_key } = action.payload;
    const obs = { ...state.allAoisList[state.currentGzId][aoiId].obs[oldKey] };
    obs.key = newKey;
    obs.tree_specie.key = tree_specie_key;
    return { ...state,
            allAoisList: {
              ...state.allAoisList,
              [state.currentGzId]: {
                ...state.allAoisList[state.currentGzId],
                [aoiId]: {
                  ...state.allAoisList[state.currentGzId][aoiId],
                  obs: {
                    ...state.allAoisList[state.currentGzId][aoiId].obs,
                    [newKey]: obs
                  }
                }
              }
            },
            currentAoiList: {
              ...state.currentAoiList,
              [aoiId]: {
                ...state.currentAoiList[aoiId],
                obs: {
                  ...state.currentAoiList[aoiId].obs,
                  [newKey]: obs
                }
              }
            }
          };
    }
    case OBS_DELETE: {
          const { key, currentAoiId, currentGzId } = action.payload;
          const newObs = { ...state.allAoisList[currentGzId][currentAoiId].obs };
          delete newObs[key];
          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [currentGzId]: {
                      ...state.allAoisList[currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[currentGzId][currentAoiId],
                        obs: newObs
                      }
                    }
                  },
                  currentAoiList: {
                    ...state.currentAoiList,
                    [currentAoiId]: {
                      ...state.currentAoiList[currentAoiId],
                      obs: newObs
                    }
                  }
                };
    }
    case OBS_DELETE_LOCAL: {
          const { key, currentAoiId } = action.payload;
          const newObs = { ...state.allAoisList[state.currentGzId][currentAoiId].obs };
          const deletedObs = { ...newObs[key], key: `deleted_${key}`, toSync: true };

          delete newObs[key];
          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[state.currentGzId][currentAoiId],
                        obs: {
                          ...newObs,
                          [`deleted_${key}`]: deletedObs
                        }
                      }
                    }
                  },
                  currentAoiList: {
                    ...state.currentAoiList,
                    [currentAoiId]: {
                      ...state.currentAoiList[currentAoiId],
                      obs: {
                        ...newObs,
                        [`deleted_${key}`]: deletedObs
                      }
                    }
                  }
                };
    }
    case AOI_DELETE: {
      const key = action.payload;
      const newAOIList = { ...state.allAoisList };
      delete newAOIList[state.currentGzId][key];
      return { ...state, allAoisList: newAOIList };
    }
    case ADD_NEW_OBS: {
          const { newObs, currentAoiId } = action.payload;

          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[state.currentGzId][currentAoiId],
                        obs: {
                          ...state.allAoisList[state.currentGzId][currentAoiId].obs,
                          [newObs.key]: newObs
                        }
                      }
                    }
                  },
                  currentAoiList: {
                    ...state.currentAoiList,
                    [currentAoiId]: {
                      ...state.currentAoiList[currentAoiId],
                      obs: {
                        ...state.currentAoiList[currentAoiId].obs,
                        [newObs.key]: newObs
                      }
                    }
                  }
                };
    }
    case ADD_NEW_AOI: {
          const { aoi } = action.payload;
          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [aoi.key]: aoi
                    }
                  },
                  currentAoiList: {
                    ...state.currentAoiList,
                    [aoi.key]: aoi
                  }
                };
    }
    case UPDATE_OBS_ALLAOI: {
          const { updatedObs, currentAoiId } = action.payload;

          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[state.currentGzId][currentAoiId],
                        obs: {
                          ...state.allAoisList[state.currentGzId][currentAoiId].obs,
                          [updatedObs.key]: updatedObs
                        }
                      }
                    }
                  }
                };
    }

    case AOI_MODAL_VISIBLE:
      return { ...state, createAOIModalVisible: action.payload};

    case UPDATE_OBS_IMAGES: {
      const { obsKey, image_aoiId, gzId, newImageList } = action.payload;
      return { ...state,
              allAoisList: {
                ...state.allAoisList,
                [gzId]: {
                  ...state.allAoisList[gzId],
                  [image_aoiId]: {
                    ...state.allAoisList[gzId][image_aoiId],
                    obs: {
                      ...state.allAoisList[gzId][image_aoiId].obs,
                      [obsKey]: {
                        ...state.allAoisList[gzId][image_aoiId].obs[obsKey],
                        images: newImageList
                      }
                    }
                  }
                }
              },
              currentAoiList: {
                ...state.currentAoiList,
                [image_aoiId]: {
                  ...state.currentAoiList[image_aoiId],
                  obs: {
                    ...state.currentAoiList[image_aoiId].obs,
                    [obsKey]: {
                      ...state.currentAoiList[image_aoiId].obs[obsKey],
                      images: newImageList
                    }
                  }
                }
              }
            };
    }
    case CLEAR_FETCHED_IMAGES:
      return { ...state, fetchedImages: 0, fetchImagesProgress: 0};

    case UPDATE_OBS_TOSYNC: {
      let { sobsKey, saoiId, sgzId, sync, tree_specie } = action.payload;
      return { ...state,
              allAoisList: {
                ...state.allAoisList,
                [sgzId]: {
                  ...state.allAoisList[sgzId],
                  [saoiId]: {
                    ...state.allAoisList[sgzId][saoiId],
                    obs: {
                      ...state.allAoisList[sgzId][saoiId].obs,
                      [sobsKey]: {
                        ...state.allAoisList[sgzId][saoiId].obs[sobsKey],
                        tree_specie,
                        toSync: sync
                      }
                    }
                  }
                }
              },
              currentAoiList: {
                ...state.currentAoiList,
                [saoiId]: {
                  ...state.currentAoiList[saoiId],
                  obs: {
                    ...state.currentAoiList[saoiId].obs,
                    [sobsKey]: {
                      ...state.currentAoiList[saoiId].obs[sobsKey],
                      tree_specie,
                      toSync: sync
                    }
                  }
                }
              }
            };
    }
    case offlineActionTypes.FETCH_OFFLINE_MODE:
      return { ...state, loading: false, currentAoiList: state.allAoisList[state.currentGzId] };

    default:
      return state;
  }
};
