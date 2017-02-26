import React from 'react';
import styles from './index.scss';

const AppDataError = () => (
  <div id={styles.root}>
    <div className="panel panel-danger">
      <div className="panel-heading">
        Error
      </div>
      <div className="panel-body">
        Connect to service failed.<br />
        Check your Internet connection.
      </div>
    </div>
  </div>
);
export default AppDataError;
