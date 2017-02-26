import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreenListFolderScreens = ({ children }) => (
  <div className={`list-group ${styles.root}`}>
    {children}
  </div>
);
SelectScreenListFolderScreens.propTypes = {
  children: PropTypes.node.isRequired,
};
export default SelectScreenListFolderScreens;
