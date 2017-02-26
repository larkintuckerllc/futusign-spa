import { combineReducers } from 'redux';
import { normalize, Schema } from 'normalizr';
import { ACTION_PREFIX } from '../strings';

// BEGINNING OF REQUIRED UPDATES
// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'snackbars';
// ACTIONS
export const ADD_SNACKBARS =
  `${ACTION_PREFIX}ADD_SNACKBARS`;
export const REMOVE_SNACKBARS =
  `${ACTION_PREFIX}REMOVE_SNACKBARS`;
export const RESET_SNACKBARS =
  `${ACTION_PREFIX}RESET_SNACKBARS`; // CUSTOM
// SCHEMA
const snackbarsSchema = new Schema('snackbars');
// REDUCERS
// CUSTOM
const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_SNACKBARS:
      return {
        ...state,
        ...action.response.entities.snackbars,
      };
    case REMOVE_SNACKBARS: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    case RESET_SNACKBARS: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case ADD_SNACKBARS:
      return [...state, action.response.result];
    case REMOVE_SNACKBARS: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    case RESET_SNACKBARS:
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
export const getSnackbar = (state, id) => state[reducerMountPoint].byId[id];
export const getFirstSnackbar = (state) => {
  const stateSlice = state[reducerMountPoint];
  return stateSlice.ids.length !== 0 ? stateSlice.byId[stateSlice.ids[0]] : null;
};
// ACTION CREATOR VALIDATORS
const validSnackbar = (snackbar) =>
  !(snackbar === undefined
  || snackbar.id === undefined
  || typeof snackbar.id !== 'number'
  || snackbar.message === undefined
  || typeof snackbar.message !== 'string'
  );
const validNewSnackbar = (state, snackbar) =>
  validSnackbar(snackbar)
  && getSnackbar(state, snackbar.id) === undefined;
// ACTION CREATORS
export const addSnackbar = (snackbar) => (dispatch, getState) => {
  const newSnackbar = snackbar;
  const id = new Date().getTime();
  newSnackbar.id = id;
  const state = getState();
  if (!validSnackbar(newSnackbar)) throw new Error();
  if (!validNewSnackbar(state, newSnackbar)) throw new Error();
  dispatch({
    type: ADD_SNACKBARS,
    response: normalize(newSnackbar, snackbarsSchema),
  });
};
export const removeSnackbar = (id) => (dispatch, getState) => {
  const state = getState();
  if (getSnackbar(state, id) === undefined) throw new Error();
  dispatch({
    type: REMOVE_SNACKBARS,
    response: normalize(getSnackbar(state, id), snackbarsSchema),
  });
};
export const resetSnackbars = () => ({
  type: RESET_SNACKBARS,
});
export const removeFirstSnackbar = () => (dispatch, getState) => {
  const firstSnackbar = getFirstSnackbar(getState());
  if (firstSnackbar === null) throw new Error();
  removeSnackbar(firstSnackbar.id)(dispatch, getState);
};
