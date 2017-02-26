import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import appBlocking from '../ducks/appBlocking';
import routesBlocking from '../ducks/routesBlocking';
import snackbars from '../ducks/snackbars';
import token from '../ducks/token';
import folders from '../ducks/folders';
import screens from '../ducks/screens';
import playables from '../ducks/playables';
import screensPlayables from '../ducks/screensPlayables';
import folderOpen from '../ducks/folderOpen';
import screenOpen from '../ducks/screenOpen';
import folderHighlight from '../ducks/folderHighlight';
import screenHighlight from '../ducks/screenHighlight';
import screensSelected from '../ducks/screensSelected';
import foldersSelected from '../ducks/foldersSelected';
import playablesAdded from '../ducks/playablesAdded';
import playablesRemoved from '../ducks/playablesRemoved';
import allFoldersSelected from '../ducks/allFoldersSelected';
import modalOpen from '../ducks/modalOpen';
import playableOpen from '../ducks/playableOpen';
import toggle from '../ducks/toggle';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  appBlocking,
  routesBlocking,
  snackbars,
  token,
  folders,
  screens,
  playables,
  screensPlayables,
  folderOpen,
  screenOpen,
  folderHighlight,
  screenHighlight,
  screensSelected,
  foldersSelected,
  playablesAdded,
  playablesRemoved,
  allFoldersSelected,
  modalOpen,
  playableOpen,
  toggle,
});
