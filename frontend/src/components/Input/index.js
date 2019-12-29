/* eslint-disable react-hooks/exhaustive-deps */
import { useField } from '@rocketseat/unform';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useMemo } from 'react';
import InputMask from 'react-input-mask';

function Input({ name, label, prepend, append, mask, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: fieldName,
        ref: ref.current,
        path: 'value',
      });
    }
  }, [ref.current, fieldName]);

  const props = {
    ...rest,
    ref,
    id: fieldName,
    name: fieldName,
    'aria-label': fieldName,
    defaultValue,
    mask,
  };

  if (mask) {
    props.maskChar = ' ';
  }

  const renderAppend = useMemo(() => {
    return (
      append && (
        <div className="append">{isFunction(append) ? append() : append}</div>
      )
    );
  }, [append]);

  const renderInput = useMemo(() => {
    const InputComponent = mask ? InputMask : 'input';

    if (prepend || append) {
      return (
        <div>
          {prepend && <input value={prepend} disabled />}
          <InputComponent {...props} />
          {renderAppend}
        </div>
      );
    }

    return <InputComponent {...props} />;
  }, [prepend, append, mask, props]);

  return (
    <>
      {label && <label htmlFor={fieldName}>{label}</label>}
      {renderInput}
      {error && <span>{error}</span>}
    </>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  prepend: PropTypes.string,
  append: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  label: PropTypes.string,
  mask: PropTypes.string,
};

Input.defaultProps = {
  label: null,
  prepend: '',
  append: '',
  mask: null,
};

export default Input;
