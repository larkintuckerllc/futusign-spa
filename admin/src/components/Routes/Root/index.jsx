import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getRoutesBlocking } from '../../../ducks/routesBlocking';
import * as fromToken from '../../../ducks/token';
import * as fromSnackbars from '../../../ducks/snackbars';
import Blocking from '../../Blocking';
import RootSnackbar from './RootSnackbar';
import RootMenu from './RootMenu';
import RootView from './RootView';

class Root extends Component {
  componentWillMount() {
    const { location: { pathname } } = this.props;
    this.prevPathname = pathname;
  }
  componentWillUpdate(nextProps) {
    const nextPathname = nextProps.location.pathname;
    const { location: { pathname } } = this.props;
    if (nextPathname !== pathname) {
      this.prevPathname = pathname;
    }
  }
  render() {
    const {
      children,
      firstSnackbar,
      removeFirstSnackbar,
      removeToken,
      routesBlocking,
    } = this.props;
    return (
      <RootView>
        {routesBlocking && <Blocking />}
        <RootSnackbar
          firstSnackbar={firstSnackbar}
          removeFirstSnackbar={removeFirstSnackbar}
        />
        <RootMenu
          removeToken={removeToken}
        />
        {React.cloneElement(children, {
          prevPathname: this.prevPathname,
        })}
      </RootView>
    );
  }
}
Root.propTypes = {
  children: PropTypes.node.isRequired,
  firstSnackbar: PropTypes.object,
  location: PropTypes.object.isRequired,
  removeFirstSnackbar: PropTypes.func.isRequired,
  removeToken: PropTypes.func.isRequired,
  routesBlocking: PropTypes.bool.isRequired,
};
export default connect(
  (state) => ({
    firstSnackbar: fromSnackbars.getFirstSnackbar(state),
    routesBlocking: getRoutesBlocking(state),
  }), {
    removeToken: fromToken.removeToken,
    removeFirstSnackbar: fromSnackbars.removeFirstSnackbar,
  }
)(Root);
