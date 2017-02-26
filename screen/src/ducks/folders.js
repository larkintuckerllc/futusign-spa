import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
import {
  getScreens,
  getScreensById,
} from './screens';
import {
  getFolderOpen,
  removeFolderOpen,
  setFolderOpen,
} from './folderOpen';
import { getScreenSelected, removeScreenSelected } from './screenSelected';
// API
import { get } from '../apis/folders';

// REDUCER MOUNT POINT
const reducerMountPoint = 'folders';
// ACTIONS
export const FETCH_FOLDERS_REQUEST = `${ACTION_PREFIX}FETCH_FOLDERS_REQUEST`;
export const FETCH_FOLDERS_SUCCESS = `${ACTION_PREFIX}FETCH_FOLDERS_SUCCESS`;
export const FETCH_FOLDERS_ERROR = `${ACTION_PREFIX}FETCH_FOLDERS_ERROR`;
export const RESET_FETCH_FOLDERS_ERROR = `${ACTION_PREFIX}RESET_FETCH_FOLDERS_ERROR`;
// SCHEMA
const folderSchema = new Schema('folders');
const foldersSchema = arrayOf(folderSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.folders,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS:
      return action.response.result;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_FOLDERS_REQUEST:
      return true;
    case FETCH_FOLDERS_SUCCESS:
    case FETCH_FOLDERS_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_FOLDERS_ERROR:
      return action.message;
    case FETCH_FOLDERS_REQUEST:
    case FETCH_FOLDERS_SUCCESS:
    case RESET_FETCH_FOLDERS_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_FOLDERS_REQUEST:
      return 'fetch';
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isAsync,
  asyncErrorMessage,
  lastAsync,
});
// ACCESSORS
const getIsAsync = (state) => state[reducerMountPoint].isAsync;
const getLastAsync = (state) => state[reducerMountPoint].lastAsync;
export const getFolder = (state, id) => state[reducerMountPoint].byId[id];
const getFoldersIds = state => state[reducerMountPoint].ids;
const getFoldersById = state => state[reducerMountPoint].byId;
export const getFolders = createSelector(
  [getFoldersIds, getFoldersById],
  (foldersIds, foldersById) => foldersIds.map(id => foldersById[id])
);
export const getIsFetchingFolders = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchFoldersErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
const passFolderId = (_, folderId) => folderId;
export const getChildScreens = createSelector(
  [getScreens, passFolderId],
  (screens, folderId) => screens.filter(o => o.parentId === folderId)
);
export const getIsFolderOpen = (state, id) => (
  getFolderOpen(state) === id
);
export const getFoldersScreenSelected = (state) => {
  const screenId = getScreenSelected(state);
  const screen = getScreensById(state)[screenId];
  return screen !== undefined ? screen : null;
};
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchFolders = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_FOLDERS_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_FOLDERS_SUCCESS,
        response: normalize(response, foldersSchema),
      }),
      error => {
        dispatch({
          type: FETCH_FOLDERS_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchFoldersError = () => ({
  type: RESET_FETCH_FOLDERS_ERROR,
});
export const setIsFolderOpen = (id, value) => (dispatch) => {
  if (value) {
    dispatch(setFolderOpen(id));
  } else {
    dispatch(removeFolderOpen());
  }
};
export const resetIsFolderOpen = () => (dispatch) => {
  dispatch(removeFolderOpen());
};
export const resetFoldersScreenSelected = () => (dispatch) => {
  removeScreenSelected()(dispatch);
};
