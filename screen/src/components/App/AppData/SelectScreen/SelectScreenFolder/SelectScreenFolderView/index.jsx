import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensListFolderView = ({
  children,
  folderId,
  folderName,
  isFolderOpen,
  setIsFolderOpen,
}) => (
  <a
    id={styles.root}
    className="list-group-item"
    onClick={() => setIsFolderOpen(folderId, !isFolderOpen)}
  >
    <div className="media">
      <div className="media-body media-middle">
        {folderName}
      </div>
      <div className="media-right media-middle">
        {!isFolderOpen &&
          <span
            className="glyphicon glyphicon-menu-down"
          />
        }
        {isFolderOpen &&
          <span
            className="glyphicon glyphicon-menu-up"
          />
        }
      </div>
    </div>
    {children}
  </a>
);
SelectScreensListFolderView.propTypes = {
  children: PropTypes.node,
  folderId: PropTypes.number.isRequired,
  folderName: PropTypes.string.isRequired,
  isFolderOpen: PropTypes.bool.isRequired,
  setIsFolderOpen: PropTypes.func.isRequired,
};
export default SelectScreensListFolderView;
