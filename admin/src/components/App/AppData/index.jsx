import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../../ducks/appBlocking';
import * as fromFolders from '../../../ducks/folders';
import * as fromScreens from '../../../ducks/screens';
import * as fromPlayables from '../../../ducks/playables';
import * as fromScreensPlayables from '../../../ducks/screensPlayables';
import AppDataError from './AppDataError';
import Routes from '../../Routes';

class AppData extends Component {
  componentWillMount() {
    this.setState({ initialProps: true });
  }
  componentDidMount() {
    const {
      fetchFolders,
      fetchPlayables,
      fetchScreens,
      fetchScreensPlayables,
      setAppBlocking,
    } = this.props;
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
          if (process.env.NODE_ENV !== 'production'
            && error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
        }
      );
  }
  componentWillReceiveProps() {
    this.setState({ initialProps: false });
  }
  render() {
    const { initialProps } = this.state;
    const {
      appBlocking,
      fetchFoldersErrorMessage,
      fetchPlayablesErrorMessage,
      fetchScreensErrorMessage,
      fetchScreensPlayablesErrorMessage,
      isFetchingFolders,
      isFetchingPlayables,
      isFetchingScreens,
      isFetchingScreensPlayables,
    } = this.props;
    if (initialProps) return null;
    if (
      isFetchingFolders
      || isFetchingScreens
      || isFetchingPlayables
      || isFetchingScreensPlayables
    ) return null;
    if (
      fetchFoldersErrorMessage !== null
      || fetchPlayablesErrorMessage !== null
      || fetchScreensErrorMessage !== null
      || fetchScreensPlayablesErrorMessage !== null
    ) return <AppDataError />;
    if (appBlocking) return null;
    return <Routes />;
  }
}
AppData.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  fetchFolders: PropTypes.func.isRequired,
  fetchPlayables: PropTypes.func.isRequired,
  fetchScreens: PropTypes.func.isRequired,
  fetchScreensPlayables: PropTypes.func.isRequired,
  fetchFoldersErrorMessage: PropTypes.string,
  fetchPlayablesErrorMessage: PropTypes.string,
  fetchScreensErrorMessage: PropTypes.string,
  fetchScreensPlayablesErrorMessage: PropTypes.string,
  isFetchingFolders: PropTypes.bool.isRequired,
  isFetchingPlayables: PropTypes.bool.isRequired,
  isFetchingScreens: PropTypes.bool.isRequired,
  isFetchingScreensPlayables: PropTypes.bool.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    fetchFoldersErrorMessage: fromFolders.getFetchFoldersErrorMessage(state),
    fetchPlayablesErrorMessage: fromPlayables.getFetchPlayablesErrorMessage(state),
    fetchScreensErrorMessage: fromScreens.getFetchScreensErrorMessage(state),
    fetchScreensPlayablesErrorMessage:
      fromScreensPlayables.getFetchScreensPlayablesErrorMessage(state),
    isFetchingFolders: fromFolders.getIsFetchingFolders(state),
    isFetchingPlayables: fromPlayables.getIsFetchingPlayables(state),
    isFetchingScreens: fromScreens.getIsFetchingScreens(state),
    isFetchingScreensPlayables: fromScreensPlayables.getIsFetchingScreensPlayables(state),
  }),
  {
    fetchFolders: fromFolders.fetchFolders,
    fetchPlayables: fromPlayables.fetchPlayables,
    fetchScreens: fromScreens.fetchScreens,
    fetchScreensPlayables: fromScreensPlayables.fetchScreensPlayables,
    setAppBlocking: fromAppBlocking.setAppBlocking,
  }
)(AppData);
