import React, { PropTypes } from 'react';
import styles from './index.scss';
import markerOff from './marker-off.svg';
import markerOn from './marker-on.svg';

const SelectScreensMapScreensScreenView = ({
  isSelectedScreen,
  isScreenHighlight,
  screenId,
  setIsSelectedScreen,
  setIsScreenHighlight,
  xCoordinate,
  yCoordinate,
}) => (
  <div
    style={{
      left: `${xCoordinate * 100}%`,
      top: `${yCoordinate * 100}%`,
      backgroundColor: isSelectedScreen ? '#00FF00' : '#006600',
    }}
    className={`${styles.root} ${isScreenHighlight ? styles.rootHighlight : ''}`}
    onMouseEnter={() => setIsScreenHighlight(screenId, true)}
    onMouseLeave={() => setIsScreenHighlight(screenId, false)}
    onMouseDown={() => setIsSelectedScreen(screenId, !isSelectedScreen)}
  >
    <div
      className={styles.rootIcon}
      style={{ background: `url(${isSelectedScreen ? markerOn : markerOff})` }}
    />
  </div>
);
SelectScreensMapScreensScreenView.propTypes = {
  isSelectedScreen: PropTypes.bool.isRequired,
  isScreenHighlight: PropTypes.bool.isRequired,
  screenId: PropTypes.number.isRequired,
  setIsSelectedScreen: PropTypes.func.isRequired,
  setIsScreenHighlight: PropTypes.func.isRequired,
  xCoordinate: PropTypes.number.isRequired,
  yCoordinate: PropTypes.number.isRequired,
};
export default SelectScreensMapScreensScreenView;
