import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getFolders } from '../../../../ducks/folders';
import * as fromToken from '../../../../ducks/token';
import SelectScreenFolders from './SelectScreenFolders';
import SelectScreenFolder from './SelectScreenFolder';

const SelectScreen = ({ folders }) => (
  <SelectScreenFolders>
    {folders.map((folder) => (
      <SelectScreenFolder
        key={folder.id}
        folderId={folder.id}
        folderName={folder.name}
      />
    ))}
  </SelectScreenFolders>
);
SelectScreen.propTypes = {
  folders: PropTypes.array.isRequired,
  removeToken: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    folders: getFolders(state),
  }), {
    removeToken: fromToken.removeToken,
  }
)(SelectScreen);
