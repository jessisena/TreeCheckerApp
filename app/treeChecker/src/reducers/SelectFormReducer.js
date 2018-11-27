  import {
    SET_CANOPY_LIST,
    SET_CROWN_LIST,
    SET_TREE_SPECIES_LIST,
    ADD_NEW_TREE_SPECIE,
    REMOVE_TREE_SPECIE
  } from '../actions/types';

  const INITIAL_STATE = {
    canopyList: {},
    crownList: {},
    treeSpeciesList: {}
  };

  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

      case SET_CANOPY_LIST:
        return { ...state, canopyList: action.payload };

      case SET_CROWN_LIST:
        return { ...state, crownList: action.payload };

      case SET_TREE_SPECIES_LIST:
        return { ...state, treeSpeciesList: action.payload };

      case ADD_NEW_TREE_SPECIE:
        console.debug('ADD_NEW_TREE_SPECIE', action.payload);
        return {
          ...state,
          treeSpeciesList: {
              ...state.treeSpeciesList,
              [action.payload.key]: action.payload
          }
        };

      case REMOVE_TREE_SPECIE: {
        const newList = { ...state.treeSpeciesList };
        delete newList[action.payload];
        return {
          ...state,
          treeSpeciesList: newList
        };
      }

      default:
        return state;
    }
  };
