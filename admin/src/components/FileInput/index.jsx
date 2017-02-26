import React, { PropTypes } from 'react';
import styles from './index.scss';

const FileInput = ({ input, disabled, resetKey, meta: { pristine, valid } }) => {
  const updatedInput = input;
  delete updatedInput.value;
  return (
    <div>
      <div className="form-group">
        <label
          htmlFor={styles.root}
          className="btn btn-default btn-file btn-sm"
          disabled={disabled}
        >
          Browse <input
            {...updatedInput}
            id={styles.root}
            key={resetKey}
            type="file"
            style={{ display: 'none' }}
          />
        </label>
      </div>
      {!valid && !pristine && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          Media must be a PDF and less than 10 MB.
        </div>
      )}
    </div>
  );
};
FileInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  resetKey: PropTypes.string.isRequired,
};
export default FileInput;
