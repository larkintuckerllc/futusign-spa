import { ACTION_PREFIX } from '../strings';

// API
export const DOWNLOADING = 'downloading';
export const UPDATEREADY = 'updateready';
// REDUCER MOUNT POINT
const reducerMountPoint = 'cacheStatus';
// ACTIONS
export const SET_CACHE_STATUS = `${ACTION_PREFIX}SET_CACHE_STATUS`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_CACHE_STATUS:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getCacheStatus = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCacheStatus = value =>
  !(value === undefined || typeof value !== 'string');
// ACTION CREATORS
export const setCacheStatus = (value) => (dispatch) => {
  if (!validCacheStatus(value)) throw new Error();
  dispatch({
    type: SET_CACHE_STATUS,
    value,
  });
};
