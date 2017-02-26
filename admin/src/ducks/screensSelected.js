import { combineReducers } from 'redux';
import { normalize, Schema } from 'normalizr';
import { ACTION_PREFIX } from '../strings';

// BEGINNING OF REQUIRED UPDATES
// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'screensSelected';
// ACTIONS
export const ADD_SCREENS_SELECTED =
  `${ACTION_PREFIX}ADD_SCREENS_SELECTED`;
export const REMOVE_SCREENS_SELECTED =
  `${ACTION_PREFIX}REMOVE_SCREENS_SELECTED`;
export const RESET_SCREENS_SELECTED =
  `${ACTION_PREFIX}RESET_SCREENS_SELECTED`; // CUSTOM
// SCHEMA
const screensSelectedSchema = new Schema('screensSelected');
// REDUCERS
// CUSTOM
const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_SCREENS_SELECTED:
      return {
        ...state,
        ...action.response.entities.screensSelected,
      };
    case REMOVE_SCREENS_SELECTED: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    case RESET_SCREENS_SELECTED: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case ADD_SCREENS_SELECTED:
      return [...state, action.response.result];
    case REMOVE_SCREENS_SELECTED: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    case RESET_SCREENS_SELECTED:
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
export const getScreenSelected = (state, id) => state[reducerMountPoint].byId[id];
export const getScreensSelectedIds = state => state[reducerMountPoint].ids;

// ACTION CREATOR VALIDATORS
const validScreenSelected = (screenSelected) =>
  !(screenSelected === undefined
  || screenSelected.id === undefined
  || typeof screenSelected.id !== 'number');
const validNewScreenSelected = (state, screenSelected) =>
  validScreenSelected(screenSelected)
  && getScreenSelected(state, screenSelected.id) === undefined;
// ACTION CREATORS
export const addScreenSelected = (screenSelected) => (dispatch, getState) => {
  const state = getState();
  if (!validScreenSelected(screenSelected)) throw new Error();
  if (!validNewScreenSelected(state, screenSelected)) throw new Error();
  dispatch({
    type: ADD_SCREENS_SELECTED,
    response: normalize(screenSelected, screensSelectedSchema),
  });
};
export const removeScreenSelected = (id) => (dispatch, getState) => {
  const state = getState();
  if (getScreenSelected(state, id) === undefined) throw new Error();
  dispatch({
    type: REMOVE_SCREENS_SELECTED,
    response: normalize(getScreenSelected(state, id), screensSelectedSchema),
  });
};
export const resetScreensSelected = () => ({
  type: RESET_SCREENS_SELECTED,
});
