import PropTypes from 'prop-types';

export default function Popup({
  show,
  color = 'primary',
  text,
  children,
}) {
  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
      }}
      className={
        'alert shadow-sm' +
        (color ? ' alert-' + color : '') +
        (!show ? ' d-none' : '')
      }
    >
      {text && <p>{text}</p>}
      {children && <p>{children}</p>}
    </div>
  );
}

Popup.propTypes = {
  show: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  text: PropTypes.node,
  children: PropTypes.node,
};
