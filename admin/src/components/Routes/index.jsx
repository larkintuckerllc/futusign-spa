import React, { PropTypes } from 'react';
import { hashHistory, IndexRoute, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './Root';
import Playables from './Playables';
import SelectScreens from './SelectScreens';
import SelectPlayables from './SelectPlayables';

const Routes = (props, { store }) => (
  <Router history={syncHistoryWithStore(hashHistory, store)}>
    <Route path="/" component={Root}>
      <IndexRoute component={SelectScreens} />
      <Route path="select_playables" component={SelectPlayables} />
      <Route path="media" component={Playables} />
    </Route>
  </Router>
);
Routes.contextTypes = {
  store: PropTypes.object.isRequired,
};
export default Routes;
