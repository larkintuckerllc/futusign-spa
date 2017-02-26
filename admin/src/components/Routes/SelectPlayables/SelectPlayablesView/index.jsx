import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesView = ({
  children,
  countAddedRemovedPlayables,
  foldersScreensSelected,
  handleFinishClick,
  push,
  updateError,
}) => (
  <div id={styles.root} className="container">
    <h4 id={styles.rootHeading}>Make Changes on {foldersScreensSelected.length} Screens</h4>
    {updateError &&
      <div id={styles.rootError} className="alert alert-danger">Failed to apply the changes.</div>}
    <div id={styles.rootControls} className="media">
      <div className="media-left">
        <button
          className="btn btn-default"
          onClick={() => push('/')}
        >Previous</button>
      </div>
      <div className="media-body" />
      <div className="media-right">
        <button
          className="btn btn-primary"
          disabled={countAddedRemovedPlayables === 0}
          onClick={handleFinishClick}
        >Finish</button>
      </div>
    </div>
    <div id={styles.rootSide}>
      {children}
    </div>
  </div>
);
SelectPlayablesView.propTypes = {
  children: PropTypes.node.isRequired,
  countAddedRemovedPlayables: PropTypes.number.isRequired,
  foldersScreensSelected: PropTypes.array.isRequired,
  handleFinishClick: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  updateError: PropTypes.string,
};
export default SelectPlayablesView;
