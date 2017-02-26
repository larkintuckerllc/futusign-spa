import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'screenOpen';
// ACTIONS
export const SET_SCREEN_OPEN = `${ACTION_PREFIX}SET_SCREEN_OPEN`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_SCREEN_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getScreenOpen = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validScreenOpen = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setScreenOpen = (value) => {
  if (!validScreenOpen(value)) throw new Error();
  return ({
    type: SET_SCREEN_OPEN,
    value,
  });
};
export const removeScreenOpen = () => ({
  type: SET_SCREEN_OPEN,
  value: null,
});
