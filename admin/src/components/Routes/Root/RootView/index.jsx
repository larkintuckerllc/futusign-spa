import React, { PropTypes } from 'react';
import styles from './index.scss';

const RootView = ({ children }) => (
  <div id={styles.root}>
    {children}
  </div>
);
RootView.propTypes = {
  children: PropTypes.node.isRequired,
};
export default RootView;
