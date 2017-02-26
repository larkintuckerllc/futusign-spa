import React, { PropTypes } from 'react';

const SelectScreenFolderScreen = ({
  screenId,
  screenName,
  setIsSelectedScreen,
}) => (
  <a
    className="list-group-item"
    onClick={() => setIsSelectedScreen(screenId, true)}
  >
    {screenName}
  </a>
);
SelectScreenFolderScreen.propTypes = {
  screenId: PropTypes.number.isRequired,
  screenName: PropTypes.string.isRequired,
  setIsSelectedScreen: PropTypes.func.isRequired,
};
export default SelectScreenFolderScreen;
