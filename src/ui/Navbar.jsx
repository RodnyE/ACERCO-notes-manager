import PropTypes from 'prop-types';

export default function Navbar({ children, className }) {
  return (
    <div className={`navbar bg-dark text-light ${className}`}>
      <div className="container-fluid">
        {children}
      </div>
    </div>
  )
}

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
