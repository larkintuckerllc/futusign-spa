import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import appBlocking from '../ducks/appBlocking';
import token from '../ducks/token';
import folders from '../ducks/folders';
import screens from '../ducks/screens';
import playables from '../ducks/playables';
import screensPlayables from '../ducks/screensPlayables';
import folderOpen from '../ducks/folderOpen';
import screenSelected from '../ducks/screenSelected';
import offlinePlaying from '../ducks/offlinePlaying';
import cacheStatus from '../ducks/cacheStatus';

export default combineReducers({
  form: formReducer,
  appBlocking,
  token,
  folders,
  screens,
  playables,
  screensPlayables,
  folderOpen,
  screenSelected,
  offlinePlaying,
  cacheStatus,
});
