import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromToken from '../../ducks/token';
import * as fromFolders from '../../ducks/folders';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import AppView from './AppView';
import Blocking from '../Blocking';
import AppAuthentication from './AppAuthentication';
import AppData from './AppData';
import Offline from './Offline';

class App extends Component {
  constructor() {
    super();
    this.checkEsc = this.checkEsc.bind(this);
  }
  componentDidMount() {
    const { fetchToken } = this.props;
    fetchToken();
    document.addEventListener('keydown', this.checkEsc);
  }
  checkEsc(e) {
    const { removeToken, resetFoldersScreenSelected, setOfflinePlaying } = this.props;
    if (e.keyCode !== 27) return;
    removeToken();
    resetFoldersScreenSelected();
    setOfflinePlaying(false);
  }
  render() {
    const {
      appBlocking,
      offlinePlaying,
      isFetchedToken,
      setAppBlocking,
      setToken,
      token,
    } = this.props;
    return (
      <AppView>
        {appBlocking && <Blocking />}
        {isFetchedToken && token === null &&
          <AppAuthentication
            setAppBlocking={setAppBlocking}
            setToken={setToken}
          />}
        {isFetchedToken && token !== null && !offlinePlaying &&
          <AppData />}
        {isFetchedToken && token !== null && offlinePlaying &&
          <Offline />}
      </AppView>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  offlinePlaying: PropTypes.bool.isRequired,
  fetchToken: PropTypes.func.isRequired,
  isFetchedToken: PropTypes.bool.isRequired,
  removeToken: PropTypes.func.isRequired,
  resetFoldersScreenSelected: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string,
};
export default connect(
  (state) => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    isFetchedToken: fromToken.getIsFetchedToken(state),
    token: fromToken.getToken(state),
  }),
  {
    fetchToken: fromToken.fetchToken,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
    setToken: fromToken.setToken,
    removeToken: fromToken.removeToken,
    resetFoldersScreenSelected:
      fromFolders.resetFoldersScreenSelected,
  }
)(App);
