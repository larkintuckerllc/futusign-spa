import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensFolders = ({
  children,
  isAllSelectedFolders,
  setIsAllSelectedFolders,
}) => (
  <div id={styles.root} className="panel panel-default">
    <div id={styles.rootHeading} className="panel-heading">
      <div className="media">
        <div className="media-body media-middle">
          Screens<br />
          <small><i>Select screens and press Next to continue.</i></small>
        </div>
        <div className="media-right media-middle">
          <button
            className="btn btn-default btn-sm"
            onClick={() => setIsAllSelectedFolders(!isAllSelectedFolders)}
          >
            {isAllSelectedFolders ? 'Unselect All' : 'Select All'}
          </button>
        </div>
      </div>
    </div>
    <div id={styles.rootList} className="list-group">
      {children}
    </div>
  </div>
);
SelectScreensFolders.propTypes = {
  children: PropTypes.node,
  isAllSelectedFolders: PropTypes.bool.isRequired,
  setIsAllSelectedFolders: PropTypes.func.isRequired,
};
export default SelectScreensFolders;
