import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensFolders = ({
  children,
}) => (
  <div
    id={styles.root}
    className="panel panel-default"
  >
    <div id={styles.rootHeading} className="panel-heading">
      Screens<br />
      <small><i>Select screen. Press &lt;esc&gt; key to logout.</i></small>
    </div>
    <div id={styles.rootList} className="list-group">
      {children}
    </div>
  </div>
);
SelectScreensFolders.propTypes = {
  children: PropTypes.node,
};
export default SelectScreensFolders;
