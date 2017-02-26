import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensMapView = ({
  children,
  mapUrl,
}) => (
  <div id={styles.root}>
    <div id={styles.rootFrame}>
      {mapUrl !== null && (
        <img src={mapUrl} alt="map" />
      )}
      {children}
    </div>
  </div>
);
SelectScreensMapView.propTypes = {
  children: PropTypes.node,
  mapUrl: PropTypes.string,
};
export default SelectScreensMapView;
