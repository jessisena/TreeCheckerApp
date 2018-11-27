import {
  OBS_UPDATE,
  OBS_CREATE,
  OBS_SAVE_SUCCESS,
  SET_SAVING_STATUS
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  tree_specie: '',
  tmp_treeSpecieName: '',
  crown_diameter: '',
  canopy_status: '',
  comment: '',
  position: {},
  images: [],
  isSaving: false,
  compass: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case OBS_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };

    case OBS_CREATE:
      return { ...state, ...INITIAL_STATE, position: action.payload.pos, name: `Tree ${action.payload.numObs}`, tree_specie: 1, crown_diameter: 1, canopy_status: 1 };

    case OBS_SAVE_SUCCESS:
      return INITIAL_STATE;

    case SET_SAVING_STATUS:
      return { ...state, isSaving: action.payload };

    default:
      return state;
  }
};
