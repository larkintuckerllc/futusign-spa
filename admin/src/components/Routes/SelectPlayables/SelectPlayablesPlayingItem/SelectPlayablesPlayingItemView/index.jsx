import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectPlayablesPlayingItem = ({
  count,
  isAddedPlayable,
  isRemovedPlayable,
  playableId,
  playableName,
  playableThumbnailUrl,
  setIsPlayableRemoved,
}) => (
  <a
    className={
      `list-group-item ${isAddedPlayable ? `disabled ${styles.disabled}` : styles.control}`
    }
    onClick={() => {
      if (!isAddedPlayable) setIsPlayableRemoved(playableId, !isRemovedPlayable);
    }}
  >
    <div className="media">
      <div className="media-body media-middle">
        <div className="media">
          <div className="media-left media-middle">
            <div className="checkbox checkbox--tight ">
              <label
                htmlFor={`p${playableId}`}
                className={isAddedPlayable ? styles.disabled : styles.control}
              >
                <input
                  className={isAddedPlayable ? styles.disabled : styles.control}
                  type="checkbox"
                  id={`p${playableId}`}
                  checked={isRemovedPlayable}
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
      </div>
      <div className="media-right media-middle">
        <span className="badge">{count.toString()}</span>
      </div>
    </div>
  </a>
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
export default SelectPlayablesPlayingItem;
