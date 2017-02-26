import React, { PropTypes } from 'react';
import styles from './index.scss';

const PlayablesView = ({ children }) => (
  <div id={styles.root} className="container">
    <h4 id={styles.rootHeading}>Media Library</h4>
    <div id={styles.rootSide}>
      {children}
    </div>
  </div>
);
PlayablesView.propTypes = {
  children: PropTypes.node,
};
export default PlayablesView;
