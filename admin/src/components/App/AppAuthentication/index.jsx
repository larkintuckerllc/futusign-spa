import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import ValidatedTextInput from '../../ValidatedTextInput';
import ValidatedPasswordInput from '../../ValidatedPasswordInput';
import { VERSION } from '../../../strings';
import styles from './index.scss';

const LOGIN_FORM = 'LOGIN_FORM';
const AppAuthentication = ({
  handleSubmit,
  submitFailed,
  submitting,
  valid,
}) => (
  <div id={styles.root}>
    <form onSubmit={handleSubmit}>
      <p>v: {VERSION}</p>
      <Field
        component={ValidatedTextInput} name="username"
        disabled={submitting} props={{ placeholder: 'username' }}
      />
      <Field
        component={ValidatedPasswordInput} name="password"
        disabled={submitting} props={{ placeholder: 'password' }}
      />
      {submitFailed && !submitting && (
        <div className="alert alert-danger" role="alert">Login failed.</div>
      )}
      <div className="form-group">
        <button
          disabled={!valid || submitting}
          type="submit" className="btn btn-default"
        >Login</button>
      </div>
    </form>
  </div>
);
AppAuthentication.propTypes = {
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
const AppAuthenticationForm = reduxForm({
  form: LOGIN_FORM,
  validate: values => {
    const errors = {};
    if (values.username === undefined) errors.username = '400';
    if (values.password === undefined) errors.password = '400';
    return errors;
  },
})(AppAuthentication);
class AppAuthenticationSubmit extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const { setAppBlocking } = this.props;
    setAppBlocking(false);
  }
  handleSubmit({ username, password }) {
    const { setAppBlocking, setToken } = this.props;
    setAppBlocking(true);
    return setToken(username, password)
      .then(
        () => {
        },
        error => {
          setAppBlocking(false);
          if (error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
          if (error.message === '401') {
            throw new SubmissionError({
              password: '400',
            });
          }
          throw new SubmissionError({});
        }
      );
  }
  render() {
    return <AppAuthenticationForm onSubmit={this.handleSubmit} />;
  }
}
AppAuthenticationSubmit.propTypes = {
  setAppBlocking: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
};
export default AppAuthenticationSubmit;
