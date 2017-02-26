import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
import {
  getAllFoldersSelected,
  setAllFoldersSelected,
} from './allFoldersSelected';
import {
  getFolderOpen,
  removeFolderOpen,
  setFolderOpen,
} from './folderOpen';
import {
  removeScreenOpen,
} from './screenOpen';
import {
  getFolderHighlight,
  removeFolderHighlight,
  setFolderHighlight,
} from './folderHighlight';
import {
  getScreens,
  getScreensById,
} from './screens';
import {
  addFolderSelected,
  getFolderSelected,
  removeFolderSelected,
  resetFoldersSelected,
} from './foldersSelected';
import {
  getScreensSelectedIds,
  resetScreensSelected,
} from './screensSelected';
import {
  getPlayablesById,
} from './playables';
// API
import { getCollection } from '../apis/folders';
import {
  getIsUpdatingScreensPlayables,
  getScreensPlayables,
  getUpdateScreensPlayablesErrorMessage,
  resetsUpdateScreensPlayablesError,
  updateScreensPlayables,
} from './screensPlayables';

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
export const getFolderIds = (state) =>
  state[reducerMountPoint].ids;
export const getFolderById = (state) =>
  state[reducerMountPoint].byId;
export const getIsFetchingFolders = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchFoldersErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
export const getIsFolderOpen = (state, id) => (
  getFolderOpen(state) === id
);
export const getWhichFolderHighlight = (state) => {
  const folderId = getFolderHighlight(state);
  return folderId !== null
    ? state[reducerMountPoint].byId[folderId]
    : null;
};
const passFolderId = (_, folderId) => folderId;
export const getChildScreens = createSelector(
  [getScreens, passFolderId],
  (screens, folderId) => screens.filter(o => o.parentId === folderId)
);
export const getIsSelectedFolder = (state, id) =>
  getFolderSelected(state, id) !== undefined;
export const getIsAllSelectedFolders = (state) =>
  getAllFoldersSelected(state);
export const getFoldersScreensSelected = createSelector(
  [getScreensSelectedIds, getScreensById],
  (screensSelectedIds, screensById) => screensSelectedIds
    .map(id => screensById[id])
);
export const getIsUpdatingFoldersScreensSelectedAddedRemovedPlayables = (state) =>
  getIsUpdatingScreensPlayables(state);
export const getUpdateFoldersScreensSelectedAddedRemovedPlayablesErrorMessage = (state) =>
  getUpdateScreensPlayablesErrorMessage(state);
export const getFoldersScreensSelectedPlayablesWithCount = createSelector(
  [getPlayablesById, getScreensSelectedIds, getScreensPlayables],
  (playablesById, screensSelectedIds, screensPlayables) => {
    const playablesWithCount = [];
    for (let i = 0; i < screensSelectedIds.length; i += 1) {
      for (let j = 0; j < screensPlayables.length; j += 1) {
        const screenPlayable = screensPlayables[j];
        if (screenPlayable.screenId === screensSelectedIds[i]) {
          const index
            = playablesWithCount.findIndex(o => o.playable.id === screenPlayable.playableId);
          if (index === -1) {
            playablesWithCount.push({
              playable: playablesById[screenPlayable.playableId],
              count: 1,
            });
          } else {
            playablesWithCount[index].count += 1;
          }
        }
      }
    }
    return playablesWithCount;
  }
);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchFolders = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_FOLDERS_REQUEST,
  });
  return getCollection()
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
  dispatch(removeScreenOpen());
  if (value) {
    dispatch(setFolderOpen(id));
  } else {
    dispatch(removeFolderOpen());
  }
};
export const resetIsFolderOpen = () => (dispatch) => {
  dispatch(removeFolderOpen());
};
export const setIsFolderHighlight = (id, value) => (dispatch) => {
  if (value) {
    dispatch(setFolderHighlight(id));
  } else {
    dispatch(removeFolderHighlight());
  }
};
export const resetIsFolderHighlight = () => (dispatch) => {
  dispatch(removeFolderHighlight());
};
export const setIsFolderSelected = (id, value) => (dispatch, getState) => {
  if (value) {
    addFolderSelected({ id })(dispatch, getState);
  } else {
    removeFolderSelected(id)(dispatch, getState);
  }
};
export const setIsAllSelectedFolders = (value) => (dispatch, getState) => {
  const state = getState();
  const folderIds = getFolderIds(state);
  for (let i = 0; i < folderIds.length; i += 1) {
    const folderId = folderIds[i];
    if (getIsSelectedFolder(state, folderId) !== value) {
      setIsFolderSelected(folderId, value)(dispatch, getState);
    }
  }
  dispatch(setAllFoldersSelected(value));
};
export const resetFoldersFolderSelected = () => (dispatch) => {
  dispatch(resetFoldersSelected());
};
export const resetFoldersScreensSelected = () => (dispatch) => {
  dispatch(resetScreensSelected());
};
export const updateFoldersScreensSelectedAddedRemovedPlayables = (
  screenIds,
  addPlayableIds,
  removePlayableIds
) => (dispatch, getState) => updateScreensPlayables(
  screenIds,
  addPlayableIds,
  removePlayableIds
)(dispatch, getState);
export const resetUpdateFoldersScreensSelectedAddedRemovedPlayablesError
  = () => dispatch => { dispatch(resetsUpdateScreensPlayablesError()); };
