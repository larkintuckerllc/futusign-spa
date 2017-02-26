import React, { Component, PropTypes } from 'react';
import styles from './index.scss';

class RootSnackbar extends Component {
  componentWillUpdate(nextProps) {
    const rootEl = document.getElementById(styles.root);
    const nextFirstSnackbar = nextProps.firstSnackbar;
    const { firstSnackbar, removeFirstSnackbar } = this.props;
    if (nextFirstSnackbar !== firstSnackbar) {
      if (nextFirstSnackbar !== null) {
        rootEl.style.transform = 'translateY(-80px)';
        window.setTimeout(() => {
          rootEl.style.transform = 'translateY(0px)';
        }, 3000);
        window.setTimeout(() => {
          removeFirstSnackbar();
        }, 4000);
      }
    }
  }
  render() {
    const { firstSnackbar } = this.props;
    return (
      <div
        id={styles.root}
      >{firstSnackbar !== null ? firstSnackbar.message : null}</div>
    );
  }
}
RootSnackbar.propTypes = {
  firstSnackbar: PropTypes.object,
  removeFirstSnackbar: PropTypes.func.isRequired,
};
export default RootSnackbar;
