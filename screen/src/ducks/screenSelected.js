import { ACTION_PREFIX } from '../strings';
import * as fromScreenSelectedApi from '../apis/screenSelected';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'screenSelected';
// ACTIONS
export const SET_SCREEN_SELECTED = `${ACTION_PREFIX}SET_SCREEN_SELECTED`;
// SCHEMA
// REDUCERS
export default (state = fromScreenSelectedApi.getScreenSelected(), action) => {
  switch (action.type) {
    case SET_SCREEN_SELECTED:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getScreenSelected = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validScreenSelected = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setScreenSelected = (value) => (dispatch) => {
  if (!validScreenSelected(value)) throw new Error();
  fromScreenSelectedApi.setScreenSelected(value);
  dispatch({
    type: SET_SCREEN_SELECTED,
    value,
  });
};
export const removeScreenSelected = () => (dispatch) => {
  fromScreenSelectedApi.removeScreenSelected();
  dispatch({
    type: SET_SCREEN_SELECTED,
    value: null,
  });
};
