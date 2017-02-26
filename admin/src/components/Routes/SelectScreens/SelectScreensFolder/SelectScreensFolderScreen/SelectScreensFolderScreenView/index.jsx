import React, { PropTypes } from 'react';
import styles from './index.scss';

const SelectScreensFolderScreenView = ({
  children,
  isSelectedScreen,
  isScreenOpen,
  screenId,
  screenName,
  setIsSelectedScreen,
  setIsScreenHighlight,
  setIsScreenOpen,
}) => (
  <a
    className="list-group-item"
    onMouseEnter={() => { setIsScreenHighlight(screenId, true); }}
    onMouseLeave={() => { setIsScreenHighlight(screenId, false); }}
  >
    <div className="media">
      <div className="media-body media-middle">
        <div className="checkbox checkbox--tight">
          <label
            htmlFor={`s${screenId}`}
          >
            <input
              className={styles.control}
              type="checkbox"
              id={`s${screenId}`}
              checked={isSelectedScreen}
              onChange={() => { setIsSelectedScreen(screenId, !isSelectedScreen); }}
            />
            {screenName}
          </label>
        </div>
      </div>
      <div className={`media-right media-middle ${styles.control}`}>
        {!isScreenOpen &&
          <span
            className="glyphicon glyphicon-film"
            onMouseDown={() => setIsScreenOpen(screenId, true)}
          />
        }
        {isScreenOpen &&
          <span
            className="glyphicon glyphicon-menu-up"
            onMouseDown={() => setIsScreenOpen(screenId, false)}
          />
        }
      </div>
    </div>
    {children}
  </a>
);
SelectScreensFolderScreenView.propTypes = {
  children: PropTypes.node,
  isSelectedScreen: PropTypes.bool.isRequired,
  isScreenOpen: PropTypes.bool.isRequired,
  screenId: PropTypes.number.isRequired,
  screenName: PropTypes.string.isRequired,
  setIsSelectedScreen: PropTypes.func.isRequired,
  setIsScreenHighlight: PropTypes.func.isRequired,
  setIsScreenOpen: PropTypes.func.isRequired,
};
export default SelectScreensFolderScreenView;
