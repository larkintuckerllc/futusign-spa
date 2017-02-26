import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, reset, SubmissionError } from 'redux-form';
import { INITIAL_SLIDE_DURATION, MIN_SLIDE_DURATION } from '../../../../strings';
import * as fromPlayables from '../../../../ducks/playables';
import * as fromSnackbars from '../../../../ducks/snackbars';
import * as fromRoutesBlocking from '../../../../ducks/routesBlocking';
import ValidatedTextInput from '../../../ValidatedTextInput';
import ValidatedNumberInput from '../../../ValidatedNumberInput';
import FileInput from '../../../FileInput';
import styles from './index.scss';

const PDF_REGEX = /pdf$/i;
const ADD_PLAYABLES_FORM = 'ADD_PLAYABLES_FORM';
const PlayablesUpload = ({ handleSubmit, submitting, submitFailed, valid, resetKey }) => (
  <div id={styles.root} className="panel panel-default">
    <div className="panel-heading">
      Upload Media<br />
      <small><i>Press Browse to select media (PDF and less than 10 MB)
      and press Upload to finish.</i></small>
    </div>
    <div className="panel-body">
      <form
        id={styles.root}
        onSubmit={handleSubmit}
      >
        <Field
          component={ValidatedTextInput} name="name"
          disabled={submitting} props={{ placeholder: 'name' }}
        />
        <div className="form-group">
          <Field
            component="input" name="description" type="text"
            disabled={submitting} placeholder="description"
            className="form-control"
          />
        </div>
        <Field
          component={ValidatedNumberInput} name="slideDuration"
          disabled={submitting} props={{ label: 'Slide Duration', placeholder: 'slide duration' }}
        />
        <Field
          component={FileInput} type="file" name="file" disabled={submitting}
          props={{ resetKey }}
        />
        {submitFailed && !submitting && (
          <div className="alert alert-danger" role="alert">Failed to upload media.</div>
        )}
        <div>
          <button
            disabled={!valid || submitting}
            type="submit" className="btn btn-primary btn-sm"
          >Upload</button>
        </div>
      </form>
    </div>
  </div>
);

PlayablesUpload.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  resetKey: PropTypes.string.isRequired,
};
const PlayablesUploadForm = reduxForm({
  form: ADD_PLAYABLES_FORM,
  initialValues: {
    slideDuration: INITIAL_SLIDE_DURATION.toString(),
  },
  validate: values => {
    const errors = {};
    const slideDurationInteger = Math.floor(Number(values.slideDuration));
    if (values.name === undefined) errors.name = '400';
    if (
      String(slideDurationInteger) !== values.slideDuration ||
      slideDurationInteger < MIN_SLIDE_DURATION
    ) errors.slideDuration = '400';
    if (values.file === undefined) errors.file = '400';
    if (values.file !== undefined && !PDF_REGEX.test(values.file[0].name)) errors.file = '415';
    if (values.file !== undefined && values.file[0].size > 10e6) errors.file = '413';
    return errors;
  },
})(PlayablesUpload);
// eslint-disable-next-line
class PlayablesUploadSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit({ name, description, slideDuration, file }) {
    const { addPlayable, addSnackbar, resetForm, setRoutesBlocking } = this.props;
    const slideDurationInteger = Math.floor(Number(slideDuration));
    setRoutesBlocking(true);
    return addPlayable({
      name,
      description: description !== undefined ? description : '',
      slideDuration: slideDurationInteger,
    }, file[0])
      .then(() => {
        resetForm();
        setRoutesBlocking(false);
        addSnackbar({ message: 'Sucessfully uploaded media.' });
      },
        (error) => {
          if (error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
          setRoutesBlocking(false);
          throw new SubmissionError({});
        }
     );
  }
  render() {
    const { resetKey } = this.props;
    return (
      <PlayablesUploadForm
        onSubmit={this.handleSubmit}
        resetKey={resetKey}
      />
    );
  }
}
PlayablesUploadSubmit.propTypes = {
  addPlayable: PropTypes.func.isRequired,
  addSnackbar: PropTypes.func.isRequired,
  resetKey: PropTypes.string.isRequired,
  resetForm: PropTypes.func.isRequired,
  setRoutesBlocking: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    resetKey: fromPlayables.getResetKey(state),
  }),
  {
    addPlayable: fromPlayables.addPlayable,
    addSnackbar: fromSnackbars.addSnackbar,
    resetForm: () => reset(ADD_PLAYABLES_FORM),
    setRoutesBlocking: fromRoutesBlocking.setRoutesBlocking,
  }
)(PlayablesUploadSubmit);
