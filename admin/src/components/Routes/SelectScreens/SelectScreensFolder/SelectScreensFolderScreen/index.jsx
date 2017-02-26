import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromScreens from '../../../../../ducks/screens';
import SelectScreensFolderScreenView
  from './SelectScreensFolderScreenView';
import SelectScreensFolderScreenPlayables
  from './SelectScreensFolderScreenPlayables';
import SelectScreensFolderScreenPlayable
  from './SelectScreensFolderScreenPlayable';

const SelectScreensFolderScreen = ({
  childPlayables,
  isSelectedScreen,
  isScreenOpen,
  screenId,
  screenName,
  setIsSelectedScreen,
  setIsScreenHighlight,
  setIsScreenOpen,
}) => (
  <SelectScreensFolderScreenView
    screenId={screenId}
    screenName={screenName}
    isSelectedScreen={isSelectedScreen}
    isScreenOpen={isScreenOpen}
    setIsSelectedScreen={setIsSelectedScreen}
    setIsScreenHighlight={setIsScreenHighlight}
    setIsScreenOpen={setIsScreenOpen}
  >
    {isScreenOpen && childPlayables.length !== 0 ?
      <SelectScreensFolderScreenPlayables>
        {childPlayables.map((playable) => (
          <SelectScreensFolderScreenPlayable
            key={playable.id}
            playableName={playable.name}
            playableThumbnailUrl={playable.thumbnailUrl}
          />
        ))}
      </SelectScreensFolderScreenPlayables> :
      null}
  </SelectScreensFolderScreenView>
);
SelectScreensFolderScreen.propTypes = {
  childPlayables: PropTypes.array.isRequired,
  isSelectedScreen: PropTypes.bool.isRequired,
  isScreenOpen: PropTypes.bool.isRequired,
  screenId: PropTypes.number.isRequired,
  screenName: PropTypes.string.isRequired,
  setIsSelectedScreen: PropTypes.func.isRequired,
  setIsScreenHighlight: PropTypes.func.isRequired,
  setIsScreenOpen: PropTypes.func.isRequired,
};
export default connect(
  (state, { screenId }) => ({
    childPlayables: fromScreens.getChildPlayables(state, screenId),
    isSelectedScreen: fromScreens.getIsSelectedScreen(state, screenId),
    isScreenOpen: fromScreens.getIsScreenOpen(state, screenId),
  }), {
    setIsSelectedScreen: fromScreens.setIsSelectedScreen,
    setIsScreenHighlight: fromScreens.setIsScreenHighlight,
    setIsScreenOpen: fromScreens.setIsScreenOpen,
  }
)(SelectScreensFolderScreen);
