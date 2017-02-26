import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'screenHighlight';
// ACTIONS
export const SET_SCREEN_HIGHLIGHT
  = `${ACTION_PREFIX}SET_SCREEN_HIGHLIGHT`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_SCREEN_HIGHLIGHT:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getScreenHighlight = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validScreenHighlight = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setScreenHighlight = (value) => {
  if (!validScreenHighlight(value)) throw new Error();
  return ({
    type: SET_SCREEN_HIGHLIGHT,
    value,
  });
};
export const removeScreenHighlight = () => ({
  type: SET_SCREEN_HIGHLIGHT,
  value: null,
});
