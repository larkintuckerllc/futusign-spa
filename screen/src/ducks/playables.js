import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { get } from '../apis/playables';

// REDUCER MOUNT POINT
const reducerMountPoint = 'playables';
// ACTIONS
export const FETCH_PLAYABLES_REQUEST = `${ACTION_PREFIX}FETCH_PLAYABLES_REQUEST`;
export const FETCH_PLAYABLES_SUCCESS = `${ACTION_PREFIX}FETCH_PLAYABLES_SUCCESS`;
export const FETCH_PLAYABLES_ERROR = `${ACTION_PREFIX}FETCH_PLAYABLES_ERROR`;
export const RESET_FETCH_PLAYABLES_ERROR = `${ACTION_PREFIX}RESET_FETCH_PLAYABLES_ERROR`;
// SCHEMA
const playableSchema = new Schema('playables');
const playablesSchema = arrayOf(playableSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.playables,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_SUCCESS:
      return action.response.result;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_REQUEST:
      return true;
    case FETCH_PLAYABLES_SUCCESS:
    case FETCH_PLAYABLES_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_ERROR:
      return action.message;
    case FETCH_PLAYABLES_REQUEST:
    case FETCH_PLAYABLES_SUCCESS:
    case RESET_FETCH_PLAYABLES_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_REQUEST:
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
export const getPlayable = (state, id) => state[reducerMountPoint].byId[id];
const getPlayablesIds = state => state[reducerMountPoint].ids;
export const getPlayablesById = state => state[reducerMountPoint].byId;
export const getPlayables = createSelector(
  [getPlayablesIds, getPlayablesById],
  (playablesIds, playablesById) => playablesIds.map(id => playablesById[id])
);
export const getIsFetchingPlayables = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchPlayablesErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchPlayables = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_PLAYABLES_REQUEST,
  });
  return get()
    .then(
      response => dispatch({
        type: FETCH_PLAYABLES_SUCCESS,
        response: normalize(response, playablesSchema),
      }),
      error => {
        dispatch({
          type: FETCH_PLAYABLES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchPlayablesError = () => ({
  type: RESET_FETCH_PLAYABLES_ERROR,
});
