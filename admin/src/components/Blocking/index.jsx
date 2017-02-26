import React from 'react';
import styles from './index.scss';

export default () => (
  <div
    id={styles.root}
  >
    <span
      id={styles.rootSpinner}
      className="glyphicon glyphicon-refresh"
    />
  </div>
);
