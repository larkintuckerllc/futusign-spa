import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensFolderScreenPlayables = ({
  children,
}) => (
  <div className={`list-group ${styles.root}`}>
    {children}
  </div>
);
SelectScreensFolderScreenPlayables.propTypes = {
  children: PropTypes.node,
};
export default SelectScreensFolderScreenPlayables;
