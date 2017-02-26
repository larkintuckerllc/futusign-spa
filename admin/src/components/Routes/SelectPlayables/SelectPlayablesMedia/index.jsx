import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesMedia = ({ children }) => (
  <div id={styles.root} className="panel panel-success">
    <div id={styles.rootHeading} className="panel-heading">
      Media Library<br />
      <small><i>Select to add.</i></small>
    </div>
    <div id={styles.rootList} className="list-group">
      {children}
    </div>
  </div>
);
SelectPlayablesMedia.propTypes = {
  children: PropTypes.node,
};
export default SelectPlayablesMedia;
