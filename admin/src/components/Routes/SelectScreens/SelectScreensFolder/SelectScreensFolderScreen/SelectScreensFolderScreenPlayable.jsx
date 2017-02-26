import React, { PropTypes } from 'react';

const SelectScreensFolderScreenPlayable = ({
  playableName,
  playableThumbnailUrl,
}) => (
  <li className="list-group-item">
    <div className="media">
      <div className="media-left media-middle">
        <div
          className="media-object app_thumbnail"
          style={{
            backgroundImage: `url(${playableThumbnailUrl})`,
          }}
        />
      </div>
      <div className="media-body media-middle">
        {playableName}
      </div>
    </div>
  </li>
);
SelectScreensFolderScreenPlayable.propTypes = {
  playableName: PropTypes.string.isRequired,
  playableThumbnailUrl: PropTypes.string.isRequired,
};
export default SelectScreensFolderScreenPlayable;
