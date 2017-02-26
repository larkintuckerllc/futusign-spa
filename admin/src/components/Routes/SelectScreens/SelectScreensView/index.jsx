import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensView = ({
  children,
  foldersScreensSelected,
  push,
}) => (
  <div id={styles.root} className="container">
    <h4 id={styles.rootHeading}>Select Screens</h4>
    <div id={styles.rootControls} className="media">
      <div className="media-body" />
      <div className="media-right">
        <button
          className="btn btn-primary"
          disabled={foldersScreensSelected.length === 0}
          onClick={() => push('/select_playables')}
        >Next</button>
      </div>
    </div>
    <div id={styles.rootSide}>
      {children}
    </div>
  </div>
);
SelectScreensView.propTypes = {
  children: PropTypes.node.isRequired,
  foldersScreensSelected: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
};
export default SelectScreensView;
