import React, { PropTypes } from 'react';
import { UPDATEREADY } from '../../../../../ducks/cacheStatus';
import styles from './index.scss';

const CacheStatusView = ({ cacheStatus }) => {
  let message;
  switch (cacheStatus) {
    case UPDATEREADY:
      message = <span>Updated.<br />Rebooting...</span>;
      break;
    default:
      message = null;
  }
  return (
    <div id={styles.root}>
      {message}
    </div>
  );
};
CacheStatusView.propTypes = {
  cacheStatus: PropTypes.string.isRequired,
};
export default CacheStatusView;
