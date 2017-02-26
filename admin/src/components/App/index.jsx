import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromToken from '../../ducks/token';
import AppView from './AppView';
import Blocking from '../Blocking';
import AppAuthentication from './AppAuthentication';
import AppData from './AppData';

class App extends Component {
  componentDidMount() {
    const { fetchToken } = this.props;
    fetchToken();
  }
  render() {
    const {
      appBlocking,
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
        {isFetchedToken && token !== null &&
          <AppData />}
      </AppView>
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  fetchToken: PropTypes.func.isRequired,
  isFetchedToken: PropTypes.bool.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string,
};
export default connect(
  (state) => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    isFetchedToken: fromToken.getIsFetchedToken(state),
    token: fromToken.getToken(state),
  }),
  {
    fetchToken: fromToken.fetchToken,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setToken: fromToken.setToken,
  }
)(App);
