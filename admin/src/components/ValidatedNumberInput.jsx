import React, { PropTypes } from 'react';

const ValidatedNumberInput = ({
  input, label, placeholder,
  disabled, meta: { touched, valid },
}) => (
  <div className={`form-group ${!valid && touched && 'has-error'}`}>
    { label !== undefined &&
      <label htmlFor={input.name}>{label}</label>
    }
    <input
      {...input}
      placeholder={placeholder}
      type="number"
      disabled={disabled}
      className="form-control"
    />
  </div>
);
ValidatedNumberInput.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
export default ValidatedNumberInput;
