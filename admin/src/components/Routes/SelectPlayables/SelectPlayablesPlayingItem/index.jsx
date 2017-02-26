import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectPlayablesPlayingItemView from './SelectPlayablesPlayingItemView';
import * as fromPlayables from '../../../../ducks/playables';

const SelectPlayablesPlayingItem = ({
  count,
  isAddedPlayable,
  isRemovedPlayable,
  playableId,
  playableName,
  playableThumbnailUrl,
  setIsPlayableRemoved,
}) => (
  <SelectPlayablesPlayingItemView
    key={playableId}
    count={count}
    playableId={playableId}
    playableName={playableName}
    playableThumbnailUrl={playableThumbnailUrl}
    isAddedPlayable={isAddedPlayable}
    isRemovedPlayable={isRemovedPlayable}
    setIsPlayableRemoved={setIsPlayableRemoved}
  />
);
SelectPlayablesPlayingItem.propTypes = {
  count: PropTypes.number.isRequired,
  isAddedPlayable: PropTypes.bool.isRequired,
  isRemovedPlayable: PropTypes.bool.isRequired,
  playableId: PropTypes.number.isRequired,
  playableName: PropTypes.string.isRequired,
  playableThumbnailUrl: PropTypes.string.isRequired,
  setIsPlayableRemoved: PropTypes.func.isRequired,
};
export default connect(
  (state, { playableId }) => ({
    isAddedPlayable: fromPlayables
      .getIsAddedPlayable(state, playableId),
    isRemovedPlayable: fromPlayables
      .getIsRemovedPlayable(state, playableId),
  }), {
    setIsPlayableRemoved: fromPlayables.setIsPlayableRemoved,
  }
)(SelectPlayablesPlayingItem);
