import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromFolders from '../../../../../ducks/folders';
import * as fromScreens from '../../../../../ducks/screens';
import SelectScreenFolderView from './SelectScreenFolderView';
import SelectScreenFolderScreens from './SelectScreenFolderScreens';
import SelectScreenFolderScreen from './SelectScreenFolderScreen';

const SelectScreenFolder = ({
  childScreens,
  isFolderOpen,
  folderId,
  folderName,
  setIsFolderOpen,
  setIsSelectedScreen,
}) => (
  <SelectScreenFolderView
    folderId={folderId}
    folderName={folderName}
    isFolderOpen={isFolderOpen}
    setIsFolderOpen={setIsFolderOpen}
  >
    {isFolderOpen && childScreens.length !== 0 ?
      <SelectScreenFolderScreens>
        {childScreens.map((screen) => (
          <SelectScreenFolderScreen
            key={screen.id}
            screenId={screen.id}
            screenName={screen.name}
            setIsSelectedScreen={setIsSelectedScreen}
          />
        ))}
      </SelectScreenFolderScreens> :
      null}
  </SelectScreenFolderView>
);
SelectScreenFolder.propTypes = {
  childScreens: PropTypes.array.isRequired,
  isFolderOpen: PropTypes.bool.isRequired,
  folderId: PropTypes.number.isRequired,
  folderName: PropTypes.string.isRequired,
  setIsFolderOpen: PropTypes.func.isRequired,
  setIsSelectedScreen: PropTypes.func.isRequired,
};
export default connect(
  (state, { folderId }) => ({
    childScreens: fromFolders.getChildScreens(state, folderId),
    isFolderOpen: fromFolders.getIsFolderOpen(state, folderId),
  }), {
    setIsFolderOpen: fromFolders.setIsFolderOpen,
    setIsSelectedScreen: fromScreens.setIsSelectedScreen,
  }
)(SelectScreenFolder);
