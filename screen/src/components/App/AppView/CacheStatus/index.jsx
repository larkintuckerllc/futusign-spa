import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromCacheStatus from '../../../../ducks/cacheStatus';
import { CACHE_INTERVAL } from '../../../../strings';
import CacheStatusView from './CacheStatusView';

class CacheStatus extends Component {
  componentDidMount() {
    const appCache = window.applicationCache;
    const { setCacheStatus } = this.props;
    const handleUpdateReady = () => {
      setCacheStatus(fromCacheStatus.UPDATEREADY);
      window.setTimeout(() => {
        window.location.reload();
      }, 5000);
    };
    const check = () => {
      appCache.update();
    };
    if (appCache.status === appCache.UPDATEREADY) {
      handleUpdateReady();
    } else {
      appCache.addEventListener('updateready', handleUpdateReady);
      if (appCache.status === appCache.UPDATEREADY) {
        handleUpdateReady();
      }
    }
    window.setInterval(check, CACHE_INTERVAL * 1000);
  }
  render() {
    const { cacheStatus } = this.props;
    return cacheStatus ? <CacheStatusView cacheStatus={cacheStatus} /> : null;
  }
}
CacheStatus.propTypes = {
  cacheStatus: PropTypes.string,
  setCacheStatus: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    cacheStatus: fromCacheStatus.getCacheStatus(state),
  }),
  {
    setCacheStatus: fromCacheStatus.setCacheStatus,
  }
)(CacheStatus);
