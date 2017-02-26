import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as fromModalOpen from '../../ducks/modalOpen';
import styles from './index.scss';

const ESC_KEYCODE = 27;
class Modal extends Component {
  componentDidMount() {
    $(`#${styles.root}`).modal({
      backdrop: 'static',
      keyboard: false,
      show: false,
    });
  }
  componentDidUpdate(prevProps) {
    const { modalOpen } = this.props;
    const prevModalOpen = prevProps.modalOpen;
    if (!prevModalOpen && modalOpen) {
      $(`#${styles.root}`).modal('show');
    }
    if (prevModalOpen && !modalOpen) {
      $(`#${styles.root}`).modal('hide');
    }
  }
  render() {
    const { children, setModalOpen, title } = this.props;
    return (
      <div
        id={styles.root}
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        onClick={() => setModalOpen(false)}
        onKeyDown={(e) => { if (e.keyCode === ESC_KEYCODE) setModalOpen(false); }}
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => setModalOpen(false)}
              ><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setModalOpen(false)}
              >Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Modal.propTypes = {
  children: PropTypes.node.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
export default connect(
  state => ({
    modalOpen: fromModalOpen.getModalOpen(state),
  }), {
    setModalOpen: fromModalOpen.setModalOpen,
  }
)(Modal);
