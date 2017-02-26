import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromFolders from '../../../../ducks/folders';
import SelectScreensFolderView
  from './SelectScreensFolderView';
import SelectScreensFolderScreens
  from './SelectScreensFolderScreens';
import SelectScreensFolderScreen
  from './SelectScreensFolderScreen';

const SelectScreensFolder = ({
  childScreens,
  isFolderOpen,
  isSelectedFolder,
  folderId,
  folderName,
  setIsFolderHighlight,
  setIsFolderOpen,
  setIsFolderSelected,
}) => (
  <SelectScreensFolderView
    folderId={folderId}
    folderName={folderName}
    isFolderOpen={isFolderOpen}
    isSelectedFolder={isSelectedFolder}
    setIsFolderOpen={setIsFolderOpen}
    setIsFolderHighlight={setIsFolderHighlight}
    setIsFolderSelected={setIsFolderSelected}
  >
    {isFolderOpen && childScreens.length !== 0 ?
      <SelectScreensFolderScreens>
        {childScreens.map((screen) => (
          <SelectScreensFolderScreen
            key={screen.id}
            screenId={screen.id}
            screenName={screen.name}
          />
        ))}
      </SelectScreensFolderScreens> :
      null}
  </SelectScreensFolderView>
);
SelectScreensFolder.propTypes = {
  childScreens: PropTypes.array.isRequired,
  isFolderOpen: PropTypes.bool.isRequired,
  isSelectedFolder: PropTypes.bool.isRequired,
  folderId: PropTypes.number.isRequired,
  folderName: PropTypes.string.isRequired,
  setIsFolderHighlight: PropTypes.func.isRequired,
  setIsFolderOpen: PropTypes.func.isRequired,
  setIsFolderSelected: PropTypes.func.isRequired,
};
export default connect(
  (state, { folderId }) => ({
    childScreens: fromFolders.getChildScreens(state, folderId),
    isFolderOpen: fromFolders.getIsFolderOpen(state, folderId),
    isSelectedFolder: fromFolders
      .getIsSelectedFolder(state, folderId),
  }), {
    setIsFolderHighlight: fromFolders.setIsFolderHighlight,
    setIsFolderOpen: fromFolders.setIsFolderOpen,
    setIsFolderSelected:
      fromFolders.setIsFolderSelected,
  }
)(SelectScreensFolder);
