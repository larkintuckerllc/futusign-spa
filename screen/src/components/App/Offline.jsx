import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromFolders from '../../ducks/folders';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import { OFFLINE_INTERVAL, SLIDESHOW_INTERVAL } from '../../strings';
import Slideshow from './Slideshow';
import Bug from './Bug';

class Offline extends Component {
  componentDidMount() {
    const { fetchFolders, setAppBlocking, setOfflinePlaying } = this.props;
    this.retryInterval = window.setInterval(() => {
      fetchFolders()
      .then(
        () => {
          setAppBlocking(true);
          setOfflinePlaying(false);
        },
        (error) => {
          if (process.env.NODE_ENV !== 'production'
            && error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
        }
      );
    }, OFFLINE_INTERVAL * 1000);
  }
  componentWillUnmount() {
    window.clearInterval(this.retryInterval);
  }
  render() {
    return (
      <div>
        <Slideshow
          idList={[0]}
          urlList={['fallback.pdf']}
          slideDurationList={[SLIDESHOW_INTERVAL]}
        />
        <Bug icon="offline" />
      </div>
    );
  }
}
Offline.propTypes = {
  fetchFolders: PropTypes.func.isRequired,
  offlinePlaying: PropTypes.string,
  setAppBlocking: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
  }),
  {
    fetchFolders: fromFolders.fetchFolders,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(Offline);
