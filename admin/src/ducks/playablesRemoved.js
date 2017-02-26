import { combineReducers } from 'redux';
import { normalize, Schema } from 'normalizr';
import { ACTION_PREFIX } from '../strings';

// BEGINNING OF REQUIRED UPDATES
// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'playablesRemoved';
// ACTIONS
export const ADD_PLAYABLES_REMOVED =
  `${ACTION_PREFIX}ADD_PLAYABLES_REMOVED`;
export const REMOVE_PLAYABLES_REMOVED =
  `${ACTION_PREFIX}REMOVE_PLAYABLES_REMOVED`;
export const RESET_PLAYABLES_REMOVED =
  `${ACTION_PREFIX}RESET_PLAYABLES_REMOVED`; // CUSTOM
// SCHEMA
const playablesRemovedSchema = new Schema('playablesRemoved');
// REDUCERS
// CUSTOM
const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_PLAYABLES_REMOVED:
      return {
        ...state,
        ...action.response.entities.playablesRemoved,
      };
    case REMOVE_PLAYABLES_REMOVED: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    case RESET_PLAYABLES_REMOVED: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case ADD_PLAYABLES_REMOVED:
      return [...state, action.response.result];
    case REMOVE_PLAYABLES_REMOVED: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    case RESET_PLAYABLES_REMOVED:
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
export const getPlayableRemoved = (state, id) => state[reducerMountPoint].byId[id];
export const getPlayablesRemovedIds = state => state[reducerMountPoint].ids;

// ACTION CREATOR VALIDATORS
const validPlayableRemoved = (playableRemoved) =>
  !(playableRemoved === undefined
  || playableRemoved.id === undefined
  || typeof playableRemoved.id !== 'number');
const validNewPlayableRemoved = (state, playableRemoved) =>
  validPlayableRemoved(playableRemoved)
  && getPlayableRemoved(state, playableRemoved.id) === undefined;
// ACTION CREATORS
export const addPlayableRemoved = (playableRemoved) => (dispatch, getState) => {
  const state = getState();
  if (!validPlayableRemoved(playableRemoved)) throw new Error();
  if (!validNewPlayableRemoved(state, playableRemoved)) throw new Error();
  dispatch({
    type: ADD_PLAYABLES_REMOVED,
    response: normalize(playableRemoved, playablesRemovedSchema),
  });
};
export const removePlayableRemoved = (id) => (dispatch, getState) => {
  const state = getState();
  if (getPlayableRemoved(state, id) === undefined) throw new Error();
  dispatch({
    type: REMOVE_PLAYABLES_REMOVED,
    response: normalize(getPlayableRemoved(state, id), playablesRemovedSchema),
  });
};
export const resetPlayablesRemoved = () => ({
  type: RESET_PLAYABLES_REMOVED,
});
