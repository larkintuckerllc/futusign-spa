import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'folderOpen';
// ACTIONS
export const SET_FOLDER_OPEN = `${ACTION_PREFIX}SET_FOLDER_OPEN`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_FOLDER_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getFolderOpen = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validFolderOpen = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setFolderOpen = (value) => {
  if (!validFolderOpen(value)) throw new Error();
  return ({
    type: SET_FOLDER_OPEN,
    value,
  });
};
export const removeFolderOpen = () => ({
  type: SET_FOLDER_OPEN,
  value: null,
});
