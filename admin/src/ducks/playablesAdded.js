import { combineReducers } from 'redux';
import { normalize, Schema } from 'normalizr';
import { ACTION_PREFIX } from '../strings';

// BEGINNING OF REQUIRED UPDATES
// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'playablesAdded';
// ACTIONS
export const ADD_PLAYABLES_ADDED =
  `${ACTION_PREFIX}ADD_PLAYABLES_ADDED`;
export const REMOVE_PLAYABLES_ADDED =
  `${ACTION_PREFIX}REMOVE_PLAYABLES_ADDED`;
export const RESET_PLAYABLES_ADDED =
  `${ACTION_PREFIX}RESET_PLAYABLES_ADDED`; // CUSTOM
// SCHEMA
const playablesAddedSchema = new Schema('playablesAdded');
// REDUCERS
// CUSTOM
const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_PLAYABLES_ADDED:
      return {
        ...state,
        ...action.response.entities.playablesAdded,
      };
    case REMOVE_PLAYABLES_ADDED: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    case RESET_PLAYABLES_ADDED: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case ADD_PLAYABLES_ADDED:
      return [...state, action.response.result];
    case REMOVE_PLAYABLES_ADDED: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    case RESET_PLAYABLES_ADDED:
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
export const getPlayableAdded = (state, id) => state[reducerMountPoint].byId[id];
export const getPlayablesAddedIds = state => state[reducerMountPoint].ids;

// ACTION CREATOR VALIDATORS
const validPlayableAdded = (playableAdded) =>
  !(playableAdded === undefined
  || playableAdded.id === undefined
  || typeof playableAdded.id !== 'number');
const validNewPlayableAdded = (state, playableAdded) =>
  validPlayableAdded(playableAdded)
  && getPlayableAdded(state, playableAdded.id) === undefined;
// ACTION CREATORS
export const addPlayableAdded = (playableAdded) => (dispatch, getState) => {
  const state = getState();
  if (!validPlayableAdded(playableAdded)) throw new Error();
  if (!validNewPlayableAdded(state, playableAdded)) throw new Error();
  dispatch({
    type: ADD_PLAYABLES_ADDED,
    response: normalize(playableAdded, playablesAddedSchema),
  });
};
export const removePlayableAdded = (id) => (dispatch, getState) => {
  const state = getState();
  if (getPlayableAdded(state, id) === undefined) throw new Error();
  dispatch({
    type: REMOVE_PLAYABLES_ADDED,
    response: normalize(getPlayableAdded(state, id), playablesAddedSchema),
  });
};
export const resetPlayablesAdded = () => ({
  type: RESET_PLAYABLES_ADDED,
});
