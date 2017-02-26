import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'folderHighlight';
// ACTIONS
export const SET_FOLDER_HIGHLIGHT
  = `${ACTION_PREFIX}SET_FOLDER_HIGHLIGHT`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_FOLDER_HIGHLIGHT:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getFolderHighlight = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validFolderHighlight = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setFolderHighlight = (value) => {
  if (!validFolderHighlight(value)) throw new Error();
  return ({
    type: SET_FOLDER_HIGHLIGHT,
    value,
  });
};
export const removeFolderHighlight = () => ({
  type: SET_FOLDER_HIGHLIGHT,
  value: null,
});
