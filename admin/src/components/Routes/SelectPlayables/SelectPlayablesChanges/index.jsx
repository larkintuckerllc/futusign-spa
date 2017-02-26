import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesChanges = ({ children }) => (
  <div id={styles.root} className="panel panel-default">
    <div id={styles.rootHeading} className="panel-heading">
      Pending Changes<br />
      <small><i>Press Finish to apply changes.</i></small>
    </div>
    <div id={styles.rootList} className="list-group">
      {children}
    </div>
  </div>
);
SelectPlayablesChanges.propTypes = {
  children: PropTypes.node,
};
export default SelectPlayablesChanges;
