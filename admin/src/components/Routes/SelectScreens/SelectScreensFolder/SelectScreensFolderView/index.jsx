import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensListFolderView = ({
  children,
  folderId,
  folderName,
  isFolderOpen,
  isSelectedFolder,
  setIsFolderHighlight,
  setIsFolderOpen,
  setIsFolderSelected,
}) => (
  <a
    className="list-group-item"
    onMouseEnter={() => { setIsFolderHighlight(folderId, true); }}
  >
    <div className="media">
      <div className="media-body media-middle">
        <div className="checkbox checkbox--tight">
          <label
            htmlFor={`f${folderId}`}
          >
            <input
              className={styles.control}
              type="checkbox"
              id={`f${folderId}`}
              checked={isSelectedFolder}
              onChange={
                () => setIsFolderSelected(folderId, !isSelectedFolder)
              }
            />
            {folderName}
          </label>
        </div>
      </div>
      <div className={`media-right media-middle ${styles.control}`}>
        {!isFolderOpen &&
          <span
            className="glyphicon glyphicon-menu-down"
            onMouseDown={() => setIsFolderOpen(folderId, true)}
          />
        }
        {isFolderOpen &&
          <span
            className="glyphicon glyphicon-menu-up"
            onMouseDown={() => setIsFolderOpen(folderId, false)}
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
  isSelectedFolder: PropTypes.bool.isRequired,
  setIsFolderHighlight: PropTypes.func.isRequired,
  setIsFolderOpen: PropTypes.func.isRequired,
  setIsFolderSelected: PropTypes.func.isRequired,
};
export default SelectScreensListFolderView;
