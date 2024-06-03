import './View.css'; // updated to include the .css extension

const View = ({ show, className, children }) => { // using arrow function syntax for brevity
  if (!show) { // return early to avoid nesting
    return null;
  }

  return (
    <div className={`view ${className}`}> {/* using backticks for template literals */}
      {children}
    </div>
  );
}

export default View; // exporting at the bottom to avoid re-renders in some scenarios
