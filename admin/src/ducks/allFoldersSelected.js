import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'allFoldersSelected';
// ACTIONS
export const SET_ALL_FOLDERS_SELECTED = `${ACTION_PREFIX}SET_ALL_FOLDERS_SELECTED`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_ALL_FOLDERS_SELECTED:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getAllFoldersSelected = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validAllFoldersSelected = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setAllFoldersSelected = (value) => {
  if (!validAllFoldersSelected(value)) throw new Error();
  return ({
    type: SET_ALL_FOLDERS_SELECTED,
    value,
  });
};
