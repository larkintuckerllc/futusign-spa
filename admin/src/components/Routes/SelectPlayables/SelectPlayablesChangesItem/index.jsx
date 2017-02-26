import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectPlayablesChangesItemView from './SelectPlayablesChangesItemView';
import * as fromPlayables from '../../../../ducks/playables';

const SelectPlayablesChangesItem = ({
  isAddedPlayable,
  isRemovedPlayable,
  playableId,
  playableName,
  playableThumbnailUrl,
}) => (
  <SelectPlayablesChangesItemView
    key={playableId}
    playableName={playableName}
    playableThumbnailUrl={playableThumbnailUrl}
    isAddedPlayable={isAddedPlayable}
    isRemovedPlayable={isRemovedPlayable}
  />
);
SelectPlayablesChangesItem.propTypes = {
  isAddedPlayable: PropTypes.bool.isRequired,
  isRemovedPlayable: PropTypes.bool.isRequired,
  playableId: PropTypes.number.isRequired,
  playableName: PropTypes.string.isRequired,
  playableThumbnailUrl: PropTypes.string.isRequired,
};
export default connect(
  (state, { playableId }) => ({
    isAddedPlayable: fromPlayables
      .getIsAddedPlayable(state, playableId),
    isRemovedPlayable: fromPlayables
      .getIsRemovedPlayable(state, playableId),
  }), null
)(SelectPlayablesChangesItem);
