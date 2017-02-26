import React, { PropTypes } from 'react';
import styles from './index.scss';

const PlayablesDetail = ({ playable }) => {
  if (playable === null) return null;
  return (
    <div id={styles.root}>
      {playable.description !== '' && <p>{playable.description}</p>}
      <p><b>Slide Duration:</b> {playable.slideDuration}</p>
      <button
        className="btn btn-default btn-sm"
        onClick={() => {
          window.open(playable.url);
        }}
      >Preview</button>
    </div>
  );
};
PlayablesDetail.propTypes = {
  playable: PropTypes.object,
};
export default PlayablesDetail;
