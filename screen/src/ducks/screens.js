import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
import { setScreenSelected, removeScreenSelected } from './screenSelected';
// API
import { get } from '../apis/screens';
import {
  getPlayablesById,
} from './playables';
import {
  getScreensPlayables,
} from './screensPlayables';
// REDUCER MOUNT POINT
const reducerMountPoint = 'screens';
// ACTIONS
export const FETCH_SCREENS_REQUEST = `${ACTION_PREFIX}FETCH_SCREENS_REQUEST`;
export const FETCH_SCREENS_SUCCESS = `${ACTION_PREFIX}FETCH_SCREENS_SUCCESS`;
export const FETCH_SCREENS_ERROR = `${ACTION_PREFIX}FETCH_SCREENS_ERROR`;
export const RESET_FETCH_SCREENS_ERROR = `${ACTION_PREFIX}RESET_FETCH_SCREENS_ERROR`;
// SCHEMA
const screenSchema = new Schema('screens');
const screensSchema = arrayOf(screenSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SCREENS_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.screens,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SCREENS_SUCCESS:
      return action.response.result;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_SCREENS_REQUEST:
      return true;
    case FETCH_SCREENS_SUCCESS:
    case FETCH_SCREENS_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREENS_ERROR:
      return action.message;
    case FETCH_SCREENS_REQUEST:
    case FETCH_SCREENS_SUCCESS:
    case RESET_FETCH_SCREENS_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREENS_REQUEST:
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
export const getScreen = (state, id) => state[reducerMountPoint].byId[id];
const getScreensIds = state => state[reducerMountPoint].ids;
export const getScreensById = state => state[reducerMountPoint].byId;
export const getScreens = createSelector(
  [getScreensIds, getScreensById],
  (screensIds, screensById) => screensIds.map(id => screensById[id])
);
export const getIsFetchingScreens = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchScreensErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
const passScreenId = (_, screenId) => screenId;
export const getChildPlayables = createSelector(
  [getScreensPlayables, getPlayablesById, passScreenId],
  (screensPlayables, playablesById, screenId) => screensPlayables
    .filter(o => o.screenId === screenId)
    .map(o => playablesById[o.playableId])
);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchScreens = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_SCREENS_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_SCREENS_SUCCESS,
        response: normalize(response, screensSchema),
      }),
      error => {
        dispatch({
          type: FETCH_SCREENS_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchScreensError = () => ({
  type: RESET_FETCH_SCREENS_ERROR,
});
export const setIsSelectedScreen = (id, value) => (dispatch) => {
  if (value) {
    setScreenSelected(id)(dispatch);
  } else {
    removeScreenSelected(id)(dispatch);
  }
};
