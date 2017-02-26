import React, { PropTypes } from 'react';
import styles from './index.scss';

const PlayablesList = ({ children }) => (
  <div id={styles.root}>
    <ul id={styles.rootList} className="list-group">
      {children}
    </ul>
  </div>
);
PlayablesList.propTypes = {
  children: PropTypes.node,
};
export default PlayablesList;
