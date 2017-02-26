import React, { PropTypes } from 'react';

const SelectPlayablesChangesItem = ({
  isAddedPlayable,
  isRemovedPlayable,
  playableName,
  playableThumbnailUrl,
}) => (
  <li
    className={[
      'list-group-item',
      isAddedPlayable ? 'list-group-item-success' : '',
      isRemovedPlayable ? 'list-group-item-danger' : '',
    ].join(' ')}
  >
    <div className="media">
      <div className="media-body media-middle">
        <div className="media">
          <div className="media-left media-middle">
            <div
              className="media-object app_thumbnail"
              style={{
                backgroundImage: `url("${playableThumbnailUrl}")`,
              }}
            />
          </div>
          <div className="media-body media-middle">
            {playableName}
          </div>
        </div>
      </div>
      <div className="media-right media-middle">
        {isAddedPlayable && <span className="badge">added</span>}
        {isRemovedPlayable && <span className="badge">removed</span>}
      </div>
    </div>
  </li>
);
SelectPlayablesChangesItem.propTypes = {
  isAddedPlayable: PropTypes.bool.isRequired,
  isRemovedPlayable: PropTypes.bool.isRequired,
  playableName: PropTypes.string.isRequired,
  playableThumbnailUrl: PropTypes.string.isRequired,
};
export default SelectPlayablesChangesItem;
