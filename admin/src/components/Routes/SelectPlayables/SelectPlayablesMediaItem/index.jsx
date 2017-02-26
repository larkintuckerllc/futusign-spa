import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectPlayablesMediaItemView from './SelectPlayablesMediaItemView';
import * as fromPlayables from '../../../../ducks/playables';

const SelectPlayablesMediaItem = ({
  isAddedPlayable,
  isRemovedPlayable,
  playableId,
  playableName,
  playableThumbnailUrl,
  setIsPlayableAdded,
}) => (
  <SelectPlayablesMediaItemView
    key={playableId}
    playableId={playableId}
    playableName={playableName}
    playableThumbnailUrl={playableThumbnailUrl}
    isAddedPlayable={isAddedPlayable}
    isRemovedPlayable={isRemovedPlayable}
    setIsPlayableAdded={setIsPlayableAdded}
  />
);
SelectPlayablesMediaItem.propTypes = {
  isAddedPlayable: PropTypes.bool.isRequired,
  isRemovedPlayable: PropTypes.bool.isRequired,
  playableId: PropTypes.number.isRequired,
  playableName: PropTypes.string.isRequired,
  playableThumbnailUrl: PropTypes.string.isRequired,
  setIsPlayableAdded: PropTypes.func.isRequired,
};
export default connect(
  (state, { playableId }) => ({
    isAddedPlayable: fromPlayables
      .getIsAddedPlayable(state, playableId),
    isRemovedPlayable: fromPlayables
      .getIsRemovedPlayable(state, playableId),
  }), {
    setIsPlayableAdded: fromPlayables.setIsPlayableAdded,
  }
)(SelectPlayablesMediaItem);
