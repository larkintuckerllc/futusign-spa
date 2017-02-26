import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromFolders from '../../../../ducks/folders';
import SelectScreensMapView from './SelectScreensMapView';
import SelectScreensMapScreens from './SelectScreensMapScreens';

const SelectScreensMap = ({
  whichFolderHighlight,
}) => {
  const mapUrl = (whichFolderHighlight !== null &&
    whichFolderHighlight.mapUrl !== undefined)
      ? whichFolderHighlight.mapUrl : null;
  return (
    <SelectScreensMapView
      mapUrl={mapUrl}
    >
      {mapUrl !== null && (
        <SelectScreensMapScreens
          folderId={whichFolderHighlight.id}
        />
      )}
    </SelectScreensMapView>
  );
};
SelectScreensMap.propTypes = {
  whichFolderHighlight: PropTypes.object,
};
export default connect(
  (state) => ({
    whichFolderHighlight:
      fromFolders.getWhichFolderHighlight(state),
  }), null
)(SelectScreensMap);
