import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromFolders from '../../../../../ducks/folders';
import SelectScreensMapScreensScreen from
  './SelectScreensMapScreensScreen';

const SelectScreensMapScreens = ({
  childScreens,
}) => (
  <div>
    {childScreens.map(screen => (
      <SelectScreensMapScreensScreen
        key={screen.id}
        screenId={screen.id}
        xCoordinate={screen.xCoordinate}
        yCoordinate={screen.yCoordinate}
      />
    ))}
  </div>
);
SelectScreensMapScreens.propTypes = {
  childScreens: PropTypes.array.isRequired,
};
export default connect(
  (state, { folderId }) => ({
    childScreens: fromFolders.getChildScreens(state, folderId),
  }), null
)(SelectScreensMapScreens);
