import React, { PropTypes } from 'react';

const Playable = ({
  playable,
  setModalOpen,
  setPlayableOpen,
}) => (
  <a
    className="list-group-item"
    onClick={() => {
      setPlayableOpen(playable);
      setModalOpen(true);
    }}
  >
    <div className="media">
      <div className="media-left media-middle">
        <div
          className="media-object app_thumbnail"
          style={{
            backgroundImage: `url(${playable.thumbnailUrl})`,
          }}
        />
      </div>
      <div className="media-body media-middle">
        {playable.name}
      </div>
    </div>
  </a>
);
Playable.propTypes = {
  playable: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setPlayableOpen: PropTypes.func.isRequired,
};
export default Playable;
