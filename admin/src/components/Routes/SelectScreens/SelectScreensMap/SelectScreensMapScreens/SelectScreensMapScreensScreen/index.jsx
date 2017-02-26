import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromScreens from '../../../../../../ducks/screens';
import SelectScreensMapScreensScreenView
  from './SelectScreensMapScreensScreenView';

const SelectScreensMapListScreen = ({
  isSelectedScreen,
  isScreenHighlight,
  screenId,
  setIsSelectedScreen,
  setIsScreenHighlight,
  xCoordinate,
  yCoordinate,
}) => (
  <SelectScreensMapScreensScreenView
    key={screenId}
    isSelectedScreen={isSelectedScreen}
    isScreenHighlight={isScreenHighlight}
    screenId={screenId}
    setIsSelectedScreen={setIsSelectedScreen}
    setIsScreenHighlight={setIsScreenHighlight}
    xCoordinate={xCoordinate}
    yCoordinate={yCoordinate}
  />
);
SelectScreensMapListScreen.propTypes = {
  isSelectedScreen: PropTypes.bool.isRequired,
  isScreenHighlight: PropTypes.bool.isRequired,
  screenId: PropTypes.number.isRequired,
  setIsSelectedScreen: PropTypes.func.isRequired,
  setIsScreenHighlight: PropTypes.func.isRequired,
  xCoordinate: PropTypes.number.isRequired,
  yCoordinate: PropTypes.number.isRequired,
};
export default connect(
  (state, { screenId }) => ({
    isSelectedScreen:
      fromScreens.getIsSelectedScreen(state, screenId),
    isScreenHighlight:
      fromScreens.getIsScreenHighlight(state, screenId),
  }), {
    setIsScreenHighlight:
      fromScreens.setIsScreenHighlight,
    setIsSelectedScreen:
      fromScreens.setIsSelectedScreen,
  }
)(SelectScreensMapListScreen);
