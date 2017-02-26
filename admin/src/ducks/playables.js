import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX, MIN_SLIDE_DURATION } from '../strings';
import { ServerException } from '../util/exceptions';
import {
  addPlayableAdded,
  getPlayableAdded,
  getPlayablesAddedIds,
  removePlayableAdded,
  resetPlayablesAdded,
} from './playablesAdded';
import {
  addPlayableRemoved,
  getPlayableRemoved,
  getPlayablesRemovedIds,
  removePlayableRemoved,
  resetPlayablesRemoved,
} from './playablesRemoved';
import {
  generateSlug,
  getScreensPlayables,
  removeScreenPlayableLocal,
} from './screensPlayables';
// API
import { del, getCollection, post } from '../apis/playables';

// REDUCER MOUNT POINT
const reducerMountPoint = 'playables';
// ACTIONS
export const FETCH_PLAYABLES_REQUEST = `${ACTION_PREFIX}FETCH_PLAYABLES_REQUEST`;
export const FETCH_PLAYABLES_SUCCESS = `${ACTION_PREFIX}FETCH_PLAYABLES_SUCCESS`;
export const FETCH_PLAYABLES_ERROR = `${ACTION_PREFIX}FETCH_PLAYABLES_ERROR`;
export const RESET_FETCH_PLAYABLES_ERROR = `${ACTION_PREFIX}RESET_FETCH_PLAYABLES_ERROR`;
export const ADD_PLAYABLE_REQUEST = `${ACTION_PREFIX}ADD_PLAYABLE_REQUEST`;
export const ADD_PLAYABLE_SUCCESS = `${ACTION_PREFIX}ADD_PLAYABLE_SUCCESS`;
export const ADD_PLAYABLE_ERROR = `${ACTION_PREFIX}ADD_PLAYABLE_ERROR`;
export const RESET_ADD_PLAYABLE_ERROR = `${ACTION_PREFIX}RESET_ADD_PLAYABLE_ERROR`;
export const REMOVE_PLAYABLE_REQUEST = `${ACTION_PREFIX}REMOVE_PLAYABLE_REQUEST`;
export const REMOVE_PLAYABLE_SUCCESS = `${ACTION_PREFIX}REMOVE_PLAYABLE_SUCCESS`;
export const REMOVE_PLAYABLE_ERROR = `${ACTION_PREFIX}REMOVE_PLAYABLE_ERROR`;
export const RESET_REMOVE_PLAYABLE_ERROR = `${ACTION_PREFIX}RESET_REMOVE_PLAYABLE_ERROR`;
// SCHEMA
const playableSchema = new Schema('playables');
const playablesSchema = arrayOf(playableSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_SUCCESS:
    case ADD_PLAYABLE_SUCCESS: {
      return {
        ...state,
        ...action.response.entities.playables,
      };
    }
    case REMOVE_PLAYABLE_SUCCESS: {
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
    case FETCH_PLAYABLES_SUCCESS:
      return action.response.result;
    case ADD_PLAYABLE_SUCCESS:
      return [...state, action.response.result];
    case REMOVE_PLAYABLE_SUCCESS: {
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
    case FETCH_PLAYABLES_REQUEST:
    case ADD_PLAYABLE_REQUEST:
    case REMOVE_PLAYABLE_REQUEST:
      return true;
    case FETCH_PLAYABLES_SUCCESS:
    case FETCH_PLAYABLES_ERROR:
    case ADD_PLAYABLE_SUCCESS:
    case ADD_PLAYABLE_ERROR:
    case REMOVE_PLAYABLE_SUCCESS:
    case REMOVE_PLAYABLE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_ERROR:
    case ADD_PLAYABLE_ERROR:
    case REMOVE_PLAYABLE_ERROR:
      return action.message;
    case FETCH_PLAYABLES_REQUEST:
    case FETCH_PLAYABLES_SUCCESS:
    case RESET_FETCH_PLAYABLES_ERROR:
    case ADD_PLAYABLE_REQUEST:
    case ADD_PLAYABLE_SUCCESS:
    case RESET_ADD_PLAYABLE_ERROR:
    case REMOVE_PLAYABLE_SUCCESS:
    case RESET_REMOVE_PLAYABLE_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_PLAYABLES_REQUEST:
      return 'fetch';
    case ADD_PLAYABLE_REQUEST:
      return 'add';
    case REMOVE_PLAYABLE_REQUEST:
      return 'remove';
    default:
      return state;
  }
};
const resetKey = (state = '-1', action) => {
  switch (action.type) {
    case ADD_PLAYABLE_SUCCESS:
      return Date.now().toString();
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
  resetKey,
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
export const getIsAddingPlayable = (state) =>
  getLastAsync(state) === 'add' && getIsAsync(state);
export const getAddPlaybableErrorMessage = (state) => (
  getLastAsync(state) === 'add' ? state[reducerMountPoint].asyncErrorMessage : null);
export const getIsRemovingPlayable = (state) =>
  getLastAsync(state) === 'remove' && getIsAsync(state);
export const getRemovePlayableErrorMessage = (state) => (
  getLastAsync(state) === 'remove' ? state[reducerMountPoint].asyncErrorMessage : null);
export const getIsAddedPlayable = (state, id) =>
  getPlayableAdded(state, id) !== undefined;
export const getIsRemovedPlayable = (state, id) =>
  getPlayableRemoved(state, id) !== undefined;
export const getAddedPlayables = createSelector(
  [getPlayablesAddedIds, getPlayablesById],
  (playablesAddedIds, playablesById) => playablesAddedIds
    .map(id => playablesById[id])
);
export const getRemovedPlayables = createSelector(
  [getPlayablesRemovedIds, getPlayablesById],
  (playablesRemovedIds, playablesById) => playablesRemovedIds
    .map(id => playablesById[id])
);
export const getResetKey = (state) => state[reducerMountPoint].resetKey;
// ACTION CREATOR VALIDATORS
const validPlayable = playable => (
  !(playable === undefined
  || playable.name === undefined
  || typeof playable.name !== 'string'
  || playable.name === ''
  || playable.description === undefined
  || typeof playable.description !== 'string'
  || playable.slideDuration === undefined
  || typeof playable.slideDuration !== 'number'
  || playable.slideDuration !== Math.floor(playable.slideDuration)
  || playable.slideDuration < MIN_SLIDE_DURATION)
);
const validExistingPlayable = (state, playable) =>
  validPlayable(playable) && getPlayable(state, playable.id) !== undefined;
const validFile = file =>
  !(file === undefined || typeof file !== 'object');
// ACTION CREATORS
export const fetchPlayables = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_PLAYABLES_REQUEST,
  });
  return getCollection()
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
export const setIsPlayableAdded = (id, value) => (dispatch, getState) => {
  if (value) {
    addPlayableAdded({ id })(dispatch, getState);
  } else {
    removePlayableAdded(id)(dispatch, getState);
  }
};
export const addPlayableLocal = (playable) => ({
  type: ADD_PLAYABLE_SUCCESS,
  response: normalize(playable, playableSchema),
});
export const addPlayable = (playable, file) => (dispatch, getState) => {
  const state = getState();
  if (getIsAsync(state)) throw new Error();
  if (!validPlayable(playable)) throw new Error();
  if (!validFile(file)) throw new Error();
  dispatch({
    type: ADD_PLAYABLE_REQUEST,
    playable,
  });
  return post(playable, file)
    .then(
      response => {
        dispatch(addPlayableLocal(response));
      },
      error => {
        dispatch({
          type: ADD_PLAYABLE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetAddPlayableError = () => ({
  type: RESET_ADD_PLAYABLE_ERROR,
});
export const resetPlayablesPlayableAdded = () => (dispatch) => {
  dispatch(resetPlayablesAdded());
};
export const setIsPlayableRemoved = (id, value) => (dispatch, getState) => {
  if (value) {
    addPlayableRemoved({ id })(dispatch, getState);
  } else {
    removePlayableRemoved(id)(dispatch, getState);
  }
};
export const resetPlayablesPlayableRemoved = () => (dispatch) => {
  dispatch(resetPlayablesRemoved());
};
export const removePlayableLocal = (id) => (dispatch, getState) => {
  const state = getState();
  const playable = getPlayable(state, id);
  if (!validExistingPlayable(state, playable)) throw new Error();
  dispatch({
    type: REMOVE_PLAYABLE_SUCCESS,
    response: normalize(playable, playableSchema),
  });
};
export const removePlayable = (id) => (dispatch, getState) => {
  const state = getState();
  const playable = getPlayable(state, id);
  if (getIsAsync(state)) throw new Error();
  if (!validExistingPlayable(state, playable)) throw new Error();
  dispatch({
    type: REMOVE_PLAYABLE_REQUEST,
    playable,
  });
  return del(playable.id)
    .then(
      () => {
        const screensPlayables = getScreensPlayables(state);
        for (let i = 0; i < screensPlayables.length; i += 1) {
          const screenPlayable = screensPlayables[i];
          if (screenPlayable.playableId === id) {
            const screenPlayableId = generateSlug({
              screenId: screenPlayable.screenId,
              playableId: screenPlayable.playableId,
            });
            removeScreenPlayableLocal(screenPlayableId)(dispatch, getState);
          }
        }
        removePlayableLocal(playable.id)(dispatch, getState);
      },
      error => {
        dispatch({
          type: REMOVE_PLAYABLE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetRemovePlayableError = () => ({
  type: RESET_REMOVE_PLAYABLE_ERROR,
});
