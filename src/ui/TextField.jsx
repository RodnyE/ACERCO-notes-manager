import PropTypes from 'prop-types';

export default function TextField({
  placeholder,
  onInput,
  type = 'text',
  placeholderColor = 'primary',
  disabled = false,
  value = '',
  id,
}) {
  const inputClasses = [
    'form-control',
    'bg-transparent',
    'time-2',
    disabled && 'disabled',
    `text-${placeholderColor}`,
  ].join(' ');

  const inputProps = {
    className: inputClasses,
    disabled,
    type,
    value,
    placeholder,
    id,
    required: placeholder ? true : false,
    onInput,
  };

  return <input {...inputProps} />;
}

TextField.propTypes = {
  placeholder: PropTypes.string,
  onInput: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password']),
  placeholderColor: PropTypes.oneOf(['primary', 'success', 'danger']),
  disabled: PropTypes.bool,
  value: PropTypes.string,
  id: PropTypes.string,
};

TextField.defaultProps = {
  placeholderColor: 'primary',
  disabled: false,
  value: '',
  id: '',
};
