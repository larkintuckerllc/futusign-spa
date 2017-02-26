import React, { PropTypes } from 'react';
import styles from './index.scss';

const AppView = ({ children }) => (
  <div id={styles.root}>
    {children}
  </div>
);
AppView.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppView;
