import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SLIDESHOW_INTERVAL } from '../../../strings';
import { getChildPlayables } from '../../../ducks/screens';
import Slideshow from '../Slideshow';
import Bug from '../Bug';

// eslint-disable-next-line
class ChildPlayables extends Component {
  render() {
    const { childPlayables } = this.props;
    if (childPlayables.length === 0) {
      return (
        <div>
          <Slideshow
            idList={[0]}
            urlList={['fallback.pdf']}
            slideDurationList={[SLIDESHOW_INTERVAL]}
          />
          <Bug icon="empty" />
        </div>
      );
    }
    return (
      <Slideshow
        idList={childPlayables.map(o => o.id)}
        urlList={childPlayables.map(o => o.url)}
        slideDurationList={childPlayables.map(o => o.slideDuration)}
      />
    );
  }
}
ChildPlayables.propTypes = {
  childPlayables: PropTypes.array.isRequired,
};
export default connect(
  (state, { screenId }) => ({
    childPlayables: getChildPlayables(state, screenId),
  }),
  null
)(ChildPlayables);
