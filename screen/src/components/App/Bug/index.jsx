import React, { PropTypes } from 'react';
import styles from './index.scss';

const Bug = ({ icon }) => (
  <div id={styles.root}>
    { icon === 'offline' &&
      <span className="glyphicon glyphicon-signal" aria-hidden="true" /> }
    { icon === 'empty' &&
      <span className="glyphicon glyphicon-film" aria-hidden="true" /> }
  </div>
);
Bug.propTypes = {
  icon: PropTypes.string.isRequired,
};
export default Bug;
