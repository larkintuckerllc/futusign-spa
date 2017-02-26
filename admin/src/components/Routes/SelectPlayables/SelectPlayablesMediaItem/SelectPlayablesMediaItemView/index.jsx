import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesMediaItem = ({
  isAddedPlayable,
  isRemovedPlayable,
  playableId,
  playableName,
  playableThumbnailUrl,
  setIsPlayableAdded,
}) => (
  <a
    className={
      `list-group-item ${isRemovedPlayable ? `disabled ${styles.disabled}` : styles.control}`
    }
    onClick={() => {
      if (!isRemovedPlayable) setIsPlayableAdded(playableId, !isAddedPlayable);
    }}
  >
    <div className="media">
      <div className="media-left media-middle">
        <div className="checkbox checkbox--tight ">
          <label
            htmlFor={`m${playableId}`}
            className={isRemovedPlayable ? styles.disabled : styles.control}
          >
            <input
              type="checkbox"
              className={isRemovedPlayable ? styles.disabled : styles.control}
              id={`m${playableId}`}
              checked={isAddedPlayable}
              onChange={() => {}}
            />
          </label>
        </div>
      </div>
      <div
        className="media-body media-middle"
      >
        <div className="media">
          <div className="media-left media-middle">
            <div
              className="media-object app_thumbnail"
              style={{
                backgroundImage: `url("${playableThumbnailUrl}")`,
              }}
            />
          </div>
          <div className="media-body media-middle">{playableName}</div>
        </div>
      </div>
    </div>
  </a>
);
SelectPlayablesMediaItem.propTypes = {
  isAddedPlayable: PropTypes.bool.isRequired,
  isRemovedPlayable: PropTypes.bool.isRequired,
  playableId: PropTypes.number.isRequired,
  playableName: PropTypes.string.isRequired,
  playableThumbnailUrl: PropTypes.string.isRequired,
  setIsPlayableAdded: PropTypes.func.isRequired,
};
export default SelectPlayablesMediaItem;
