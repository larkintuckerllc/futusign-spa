import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensListFolderScreens = ({ children }) => (
  <div className={`list-group ${styles.root}`}>
    {children}
  </div>
);
SelectScreensListFolderScreens.propTypes = {
  children: PropTypes.node.isRequired,
};
export default SelectScreensListFolderScreens;
