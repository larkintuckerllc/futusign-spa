import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/screensPlayables';

// REDUCER MOUNT POINT
const reducerMountPoint = 'screensPlayables';
// ACTIONS
export const FETCH_SCREENS_PLAYABLES_REQUEST = `${ACTION_PREFIX}FETCH_SCREENS_PLAYABLES_REQUEST`;
export const FETCH_SCREENS_PLAYABLES_SUCCESS = `${ACTION_PREFIX}FETCH_SCREENS_PLAYABLES_SUCCESS`;
export const FETCH_SCREENS_PLAYABLES_ERROR = `${ACTION_PREFIX}FETCH_SCREENS_PLAYABLES_ERROR`;
export const RESET_FETCH_SCREENS_PLAYABLES_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_SCREENS_PLAYABLES_ERROR`;
// SCHEMA
export const generateSlug = (entity) => `s${entity.screenId}p${entity.playableId}`;
const screenPlayableSchema = new Schema('screensPlayables', { idAttribute: generateSlug });
const screensPlayablesSchema = arrayOf(screenPlayableSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.screensPlayables,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_SUCCESS:
      return action.response.result;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_REQUEST:
      return true;
    case FETCH_SCREENS_PLAYABLES_SUCCESS:
    case FETCH_SCREENS_PLAYABLES_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_ERROR:
      return action.message;
    case FETCH_SCREENS_PLAYABLES_REQUEST:
    case FETCH_SCREENS_PLAYABLES_SUCCESS:
    case RESET_FETCH_SCREENS_PLAYABLES_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_REQUEST:
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
export const getScreenPlayable = (state, id) => state[reducerMountPoint].byId[id];
const getScreensPlayablesIds = state => state[reducerMountPoint].ids;
const getScreensPlayablesById = state => state[reducerMountPoint].byId;
export const getScreensPlayables = createSelector(
  [getScreensPlayablesIds, getScreensPlayablesById],
  (screensPlayablesIds, screensPlayablesById) => screensPlayablesIds
    .map(id => screensPlayablesById[id])
);
export const getIsFetchingScreensPlayables = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchScreensPlayablesErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchScreensPlayables = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_SCREENS_PLAYABLES_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_SCREENS_PLAYABLES_SUCCESS,
        response: normalize(response, screensPlayablesSchema),
      }),
      error => {
        dispatch({
          type: FETCH_SCREENS_PLAYABLES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchScreensPlayablesError = () => ({
  type: RESET_FETCH_SCREENS_PLAYABLES_ERROR,
});
