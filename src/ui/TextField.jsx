
export default function TextField ({placeholder, onInput, type, value, disabled, color}) {
    return (
      <input 
        className={
          "form-control bg-transparent time-2" 
          + (disabled ? " disabled text-secondary" : "")
          + (color === "success" ? " is-valid" : "")
          + (color === "danger" ? " is-invalid" : "")
        }
        disabled={disabled}
        type={type}
        value={value}
        placeholder={placeholder}
        
        onInput={onInput}
      />
    );
}