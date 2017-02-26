import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesEditor = ({ children }) => (
  <div id={styles.root}>
    {children}
  </div>
);
SelectPlayablesEditor.propTypes = {
  children: PropTypes.node,
};
export default SelectPlayablesEditor;
