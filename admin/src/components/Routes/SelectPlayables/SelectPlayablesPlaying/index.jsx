import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesPlaying = ({ children }) => (
  <div id={styles.root} className="panel panel-danger">
    <div id={styles.rootHeading} className="panel-heading">
      Currently Playing<br />
      <small><i>Select to remove.</i></small>
    </div>
    <div id={styles.rootList} className="list-group">
      {children}
    </div>
  </div>
);
SelectPlayablesPlaying.propTypes = {
  children: PropTypes.node,
};
export default SelectPlayablesPlaying;
