import React, { PropTypes } from 'react';
import styles from './index.scss';
import CacheStatus from './CacheStatus';

const AppView = ({ children }) => (
  <div id={styles.root}>
    <CacheStatus />
    {children}
  </div>
);
AppView.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppView;
