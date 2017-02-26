import { combineReducers } from 'redux';
import { ServerException } from '../util/exceptions';
// API
import { del, getElement, post } from '../apis/token';

// REDUCER MOUNT POINT
const reducerMountPoint = 'token';
// ACTIONS
const actionPrefix = 'app/';
export const FETCH_TOKEN = `${actionPrefix}FETCH_TOKEN`;
export const SET_TOKEN_REQUEST = `${actionPrefix}SET_TOKEN_REQUEST`;
export const SET_TOKEN_SUCCESS = `${actionPrefix}SET_TOKEN_SUCCESS`;
export const SET_TOKEN_ERROR = `${actionPrefix}SET_TOKEN_ERROR`;
export const REMOVE_TOKEN = `${actionPrefix}REMOVE_TOKEN`;

// END OF REQUIRED UPDATES
// SCHEMA
// REDUCERS
const value = (state = null, action) => {
  switch (action.type) {
    case FETCH_TOKEN:
    case SET_TOKEN_SUCCESS: {
      return action.response;
    }
    case REMOVE_TOKEN: {
      return null;
    }
    default:
      return state;
  }
};
const isFetched = (state = false, action) => {
  switch (action.type) {
    case FETCH_TOKEN: {
      return true;
    }
    default:
      return state;
  }
};
const isSetting = (state = false, action) => {
  switch (action.type) {
    case SET_TOKEN_REQUEST:
      return true;
    case SET_TOKEN_SUCCESS:
    case SET_TOKEN_ERROR:
      return false;
    default:
      return state;
  }
};
const setErrorMessage = (state = null, action) => {
  switch (action.type) {
    case SET_TOKEN_ERROR:
      return action.message;
    case SET_TOKEN_REQUEST:
    case SET_TOKEN_SUCCESS:
      return null;
    default:
      return state;
  }
};
export default combineReducers({
  value,
  isFetched,
  isSetting,
  setErrorMessage,
});
// ACCESSORS
export const getToken = (state) => state[reducerMountPoint].value;
export const getIsFetchedToken = (state) => state[reducerMountPoint].isFetched;
export const getIsSettingToken = (state) => state[reducerMountPoint].isSetting;
export const getSetTokenErrorMessage = (state) => state[reducerMountPoint].setErrorMessage;
// ACTION CREATOR VALIDATORS
const validUsernamePassword = (username, password) =>
  !(username === undefined || typeof username !== 'string' ||
    password === undefined || typeof password !== 'string');
// ACTION CREATORS
export const fetchToken = () => (dispatch) => {
  dispatch({
    type: FETCH_TOKEN,
    response: getElement(),
  });
};
export const setToken = (username, password) => (dispatch) => {
  if (!validUsernamePassword(username, password)) throw new Error();
  dispatch({
    type: SET_TOKEN_REQUEST,
    username,
    password,
  });
  return post(username, password)
    .then(
        response => {
          dispatch({
            type: SET_TOKEN_SUCCESS,
            response,
          });
        },
        error => {
          dispatch({
            type: SET_TOKEN_ERROR,
            message: error.message,
          });
          throw new ServerException(error.message);
        }
      );
};
export const removeToken = () => (dispatch) => {
  dispatch({
    type: REMOVE_TOKEN,
    token: del(),
  });
};
