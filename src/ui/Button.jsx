import PropTypes from 'prop-types';

export default function Button({ onClick, children, type = 'button', disabled, disabledStyle, tabIndex }) {
  const btnClass = `btn btn-primary time-2 ${disabled ? 'disabled' : ''}`;

  return (
    <button
      onClick={onClick}
      className={btnClass}
      style={disabled ? disabledStyle : null}
      type={type}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  disabledStyle: PropTypes.object,
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
