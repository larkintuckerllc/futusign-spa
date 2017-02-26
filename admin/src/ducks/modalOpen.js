import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'modalOpen';
// ACTIONS
export const SET_MODAL_OPEN = `${ACTION_PREFIX}SET_MODAL_OPEN`;
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_MODAL_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getModalOpen = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validModalOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// ACTION CREATORS
export const setModalOpen = (value) => {
  if (!validModalOpen(value)) throw new Error();
  return ({
    type: SET_MODAL_OPEN,
    value,
  });
};
