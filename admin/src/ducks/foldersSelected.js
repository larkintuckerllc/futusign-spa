import { combineReducers } from 'redux';
import { normalize, Schema } from 'normalizr';
import { ACTION_PREFIX } from '../strings';
import { getChildScreens } from './folders';
import { getIsSelectedScreen, setIsSelectedScreen } from './screens';

// BEGINNING OF REQUIRED UPDATES
// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'foldersSelected';
// ACTIONS
export const ADD_FOLDERS_SELECTED =
  `${ACTION_PREFIX}ADD_FOLDERS_SELECTED`;
export const REMOVE_FOLDERS_SELECTED =
  `${ACTION_PREFIX}REMOVE_FOLDERS_SELECTED`;
export const RESET_FOLDERS_SELECTED =
  `${ACTION_PREFIX}RESET_FOLDERS_SELECTED`; // CUSTOM
// SCHEMA
const foldersSelectedSchema = new Schema('foldersSelected');
// REDUCERS
// CUSTOM
const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_FOLDERS_SELECTED:
      return {
        ...state,
        ...action.response.entities.foldersSelected,
      };
    case REMOVE_FOLDERS_SELECTED: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    case RESET_FOLDERS_SELECTED: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case ADD_FOLDERS_SELECTED:
      return [...state, action.response.result];
    case REMOVE_FOLDERS_SELECTED: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    case RESET_FOLDERS_SELECTED:
      return [];
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
});
// ACCESSORS
export const getFolderSelected = (state, id) => state[reducerMountPoint].byId[id];
// ACTION CREATOR VALIDATORS
const validFolderSelected = (folderSelected) =>
  !(folderSelected === undefined
  || folderSelected.id === undefined
  || typeof folderSelected.id !== 'number');
const validNewFolderSelected = (state, folderSelected) =>
  validFolderSelected(folderSelected)
  && getFolderSelected(state, folderSelected.id) === undefined;
// ACTION CREATORS
const childScreensSetIsSelectedScreen = (folderId, value) => (dispatch, getState) => {
  const state = getState();
  const childScreens = getChildScreens(state, folderId);
  for (let i = 0; i < childScreens.length; i += 1) {
    const childScreen = childScreens[i];
    if (getIsSelectedScreen(state, childScreen.id) !== value) {
      setIsSelectedScreen(childScreen.id, value)(dispatch, getState);
    }
  }
};
export const addFolderSelected = (folderSelected) => (dispatch, getState) => {
  const state = getState();
  if (!validFolderSelected(folderSelected)) throw new Error();
  if (!validNewFolderSelected(state, folderSelected)) throw new Error();
  dispatch({
    type: ADD_FOLDERS_SELECTED,
    response: normalize(folderSelected, foldersSelectedSchema),
  });
  childScreensSetIsSelectedScreen(folderSelected.id, true)(dispatch, getState);
};
export const removeFolderSelected = (id) => (dispatch, getState) => {
  const state = getState();
  if (getFolderSelected(state, id) === undefined) throw new Error();
  dispatch({
    type: REMOVE_FOLDERS_SELECTED,
    response: normalize(getFolderSelected(state, id),
      foldersSelectedSchema),
  });
  childScreensSetIsSelectedScreen(id, false)(dispatch, getState);
};
export const resetFoldersSelected = () => ({
  type: RESET_FOLDERS_SELECTED,
});
