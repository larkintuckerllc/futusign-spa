import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';
import { ServerException } from '../util/exceptions';
// API
import { getCollection, update } from '../apis/screensPlayables';

// REDUCER MOUNT POINT
const reducerMountPoint = 'screensPlayables';
// ACTIONS
export const FETCH_SCREENS_PLAYABLES_REQUEST = `${ACTION_PREFIX}FETCH_SCREENS_PLAYABLES_REQUEST`;
export const FETCH_SCREENS_PLAYABLES_SUCCESS = `${ACTION_PREFIX}FETCH_SCREENS_PLAYABLES_SUCCESS`;
export const FETCH_SCREENS_PLAYABLES_ERROR = `${ACTION_PREFIX}FETCH_SCREENS_PLAYABLES_ERROR`;
export const RESET_FETCH_SCREENS_PLAYABLES_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_SCREENS_PLAYABLES_ERROR`;
export const ADD_SCREENS_PLAYABLES = `${ACTION_PREFIX}ADD_SCREENS_PLAYABLES`;
export const REMOVE_SCREENS_PLAYABLES = `${ACTION_PREFIX}REMOVE_SCREENS_PLAYABLES`;
export const UPDATE_SCREENS_PLAYABLES_REQUEST = `${ACTION_PREFIX}UPDATE_SCREENS_PLAYABLES_REQUEST`;
export const UPDATE_SCREENS_PLAYABLES_SUCCESS = `${ACTION_PREFIX}UPDATE_SCREENS_PLAYABLES_SUCCESS`;
export const UPDATE_SCREENS_PLAYABLES_ERROR = `${ACTION_PREFIX}UPDATE_SCREENS_PLAYABLES_ERROR`;
export const RESET_UPDATE_SCREENS_PLAYABLES_ERROR
  = `${ACTION_PREFIX}RESET_UPDATE_SCREENS_PLAYABLES_ERROR`;
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
    case ADD_SCREENS_PLAYABLES:
      return {
        ...state,
        ...action.response.entities.screensPlayables,
      };
    case REMOVE_SCREENS_PLAYABLES: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_SUCCESS:
      return action.response.result;
    case ADD_SCREENS_PLAYABLES:
      return [...state, action.response.result];
    case REMOVE_SCREENS_PLAYABLES: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_REQUEST:
    case UPDATE_SCREENS_PLAYABLES_REQUEST:
      return true;
    case FETCH_SCREENS_PLAYABLES_SUCCESS:
    case FETCH_SCREENS_PLAYABLES_ERROR:
    case UPDATE_SCREENS_PLAYABLES_SUCCESS:
    case UPDATE_SCREENS_PLAYABLES_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_ERROR:
    case UPDATE_SCREENS_PLAYABLES_ERROR:
      return action.message;
    case FETCH_SCREENS_PLAYABLES_REQUEST:
    case FETCH_SCREENS_PLAYABLES_SUCCESS:
    case RESET_FETCH_SCREENS_PLAYABLES_ERROR:
    case UPDATE_SCREENS_PLAYABLES_REQUEST:
    case UPDATE_SCREENS_PLAYABLES_SUCCESS:
    case RESET_UPDATE_SCREENS_PLAYABLES_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_SCREENS_PLAYABLES_REQUEST:
      return 'fetch';
    case UPDATE_SCREENS_PLAYABLES_REQUEST:
      return 'update';
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
export const getIsUpdatingScreensPlayables = (state) =>
  getLastAsync(state) === 'update' && getIsAsync(state);
export const getUpdateScreensPlayablesErrorMessage = (state) => (
  getLastAsync(state) === 'update' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchScreensPlayables = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_SCREENS_PLAYABLES_REQUEST,
  });
  return getCollection()
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
const addScreenPlayableLocal = (screenPlayable) => ({
  type: ADD_SCREENS_PLAYABLES,
  response: normalize(screenPlayable, screenPlayableSchema),
});
export const removeScreenPlayableLocal = (id) => (dispatch, getState) => {
  const state = getState();
  dispatch({
    type: REMOVE_SCREENS_PLAYABLES,
    response: normalize(getScreenPlayable(state, id), screenPlayableSchema),
  });
};
export const updateScreensPlayables = (
  screenIds,
  addPlayableIds,
  removePlayableIds
) => (dispatch, getState) => {
  if (
    screenIds === undefined ||
    !Array.isArray(screenIds) ||
    addPlayableIds === undefined ||
    !Array.isArray(addPlayableIds) ||
    removePlayableIds === undefined ||
    !Array.isArray(removePlayableIds)
  ) throw new Error();
  const state = getState();
  dispatch({
    type: UPDATE_SCREENS_PLAYABLES_REQUEST,
    screenIds,
    addPlayableIds,
    removePlayableIds,
  });
  return update({
    screenIds,
    addPlayableIds,
    removePlayableIds,
  })
    .then(
      response => {
        // REMOVES
        for (let i = 0; i < removePlayableIds.length; i++) {
          const playableId = removePlayableIds[i];
          for (let j = 0; j < screenIds.length; j++) {
            const screenId = screenIds[j];
            const id = generateSlug({
              screenId,
              playableId,
            });
            if (getScreensPlayablesById(state)[id] !== undefined) {
              removeScreenPlayableLocal(id)(dispatch, getState);
            }
          }
        }
        // ADDS
        for (let i = 0; i < addPlayableIds.length; i++) {
          const playableId = addPlayableIds[i];
          for (let j = 0; j < screenIds.length; j++) {
            const screenId = screenIds[j];
            const id = generateSlug({
              screenId,
              playableId,
            });
            if (getScreensPlayablesById(state)[id] === undefined) {
              dispatch(addScreenPlayableLocal({
                screenId,
                playableId,
              }));
            }
          }
        }
        dispatch({
          type: UPDATE_SCREENS_PLAYABLES_SUCCESS,
          response,
        });
      },
      error => {
        dispatch({
          type: UPDATE_SCREENS_PLAYABLES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetsUpdateScreensPlayablesError = () => ({
  type: RESET_UPDATE_SCREENS_PLAYABLES_ERROR,
});
