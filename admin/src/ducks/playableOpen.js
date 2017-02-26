import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'playableOpen';
// ACTIONS
export const SET_PLAYABLE_OPEN = `${ACTION_PREFIX}SET_PLAYABLE_OPEN`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_PLAYABLE_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getPlayableOpen = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validPlayableOpen = value =>
  !(value === undefined || typeof value !== 'object');
// ACTION CREATORS
export const setPlayableOpen = (value) => {
  if (!validPlayableOpen(value)) throw new Error();
  return ({
    type: SET_PLAYABLE_OPEN,
    value,
  });
};
export const removePlayableOpen = () => ({
  type: SET_PLAYABLE_OPEN,
  value: null,
});
