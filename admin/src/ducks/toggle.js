import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'toggle';
// ACTIONS
export const SET_TOGGLE = `${ACTION_PREFIX}SET_TOGGLE`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_TOGGLE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getToggle = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validToggle = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setToggle = (value) => {
  if (!validToggle(value)) throw new Error();
  return ({
    type: SET_TOGGLE,
    value,
  });
};
