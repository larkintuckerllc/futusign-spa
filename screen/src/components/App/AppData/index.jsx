import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../../ducks/appBlocking';
import * as fromFolders from '../../../ducks/folders';
import * as fromScreens from '../../../ducks/screens';
import * as fromPlayables from '../../../ducks/playables';
import * as fromScreensPlayables from '../../../ducks/screensPlayables';
import * as fromOfflinePlaying from '../../../ducks/offlinePlaying';
import { DATA_INTERVAL } from '../../../strings';
import SelectScreen from './SelectScreen';
import ChildPlayables from './ChildPlayables';

class AppData extends Component {
  componentDidMount() {
    const {
      fetchFolders,
      fetchPlayables,
      fetchScreens,
      fetchScreensPlayables,
      setAppBlocking,
      setOfflinePlaying,
    } = this.props;
    const fetch = () => {
      Promise.all([
        fetchFolders(),
        fetchPlayables(),
        fetchScreens(),
        fetchScreensPlayables(),
      ])
        .then(
          () => {
            setAppBlocking(false);
          },
          (error) => {
            setAppBlocking(false);
            setOfflinePlaying(true);
            if (process.env.NODE_ENV !== 'production'
              && error.name !== 'ServerException') {
              window.console.log(error);
              return;
            }
          }
        );
    };
    fetch();
    this.refreshInterval = window.setInterval(fetch, DATA_INTERVAL * 1000);
  }
  componentWillUnmount() {
    window.clearInterval(this.refreshInterval);
  }
  render() {
    const {
      appBlocking,
      foldersScreenSelected,
    } = this.props;
    if (appBlocking) return null;
    if (foldersScreenSelected !== null) {
      return <ChildPlayables screenId={foldersScreenSelected.id} />;
    }
    return <SelectScreen />;
  }
}
AppData.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  fetchFolders: PropTypes.func.isRequired,
  fetchPlayables: PropTypes.func.isRequired,
  fetchScreens: PropTypes.func.isRequired,
  fetchScreensPlayables: PropTypes.func.isRequired,
  foldersScreenSelected: PropTypes.object,
  setAppBlocking: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    foldersScreenSelected: fromFolders.getFoldersScreenSelected(state),
  }),
  {
    fetchFolders: fromFolders.fetchFolders,
    fetchPlayables: fromPlayables.fetchPlayables,
    fetchScreens: fromScreens.fetchScreens,
    fetchScreensPlayables: fromScreensPlayables.fetchScreensPlayables,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(AppData);
