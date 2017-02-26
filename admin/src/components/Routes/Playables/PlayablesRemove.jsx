import React, { PropTypes, Component } from 'react';
import { reduxForm, SubmissionError } from 'redux-form';

export const REMOVE_PLAYABLE_FORM = 'REMOVE_PLAYABLE_FORM';
const PlayablesRemove = ({ handleSubmit, submitting,
  submitFailed }) =>
    <form onSubmit={handleSubmit}>
      {submitFailed && !submitting &&
        <div className="alert alert-danger">Failed to remove media.</div>}
      <div className="form-group">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-danger btn-sm"
        >Remove</button>
      </div>
    </form>;
PlayablesRemove.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
};
const PlayablesRemoveForm = reduxForm({
  form: REMOVE_PLAYABLE_FORM,
  enableReinitialize: true,
})(PlayablesRemove);
class PlayablesRemoveSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    const {
      addSnackbar,
      playable,
      removePlayable,
      setModalOpen,
      setRoutesBlocking,
    } = this.props;
    setRoutesBlocking(true);
    return removePlayable(playable.id)
      .then(
        () => {
          setModalOpen(false);
          setRoutesBlocking(false);
          addSnackbar({ message: 'Succesfully removed media.' });
        },
        (error) => {
          if (process.env.NODE_ENV !== 'production'
            && error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
          setRoutesBlocking(false);
          throw new SubmissionError({});
        }
      );
  }
  render() {
    return (
      <PlayablesRemoveForm onSubmit={this.handleSubmit} />
    );
  }
}
PlayablesRemoveSubmit.propTypes = {
  addSnackbar: PropTypes.func.isRequired,
  playable: PropTypes.object,
  removePlayable: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setRoutesBlocking: PropTypes.func.isRequired,
};
export default PlayablesRemoveSubmit;
