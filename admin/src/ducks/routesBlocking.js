import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'routesBlocking';
// ACTIONS
export const SET_ROUTES_BLOCKING = `${ACTION_PREFIX}SET_ROUTES_BLOCKING`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_ROUTES_BLOCKING:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getRoutesBlocking = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validRoutesBlocking = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setRoutesBlocking = (value) => {
  if (!validRoutesBlocking(value)) throw new Error();
  return ({
    type: SET_ROUTES_BLOCKING,
    value,
  });
};
