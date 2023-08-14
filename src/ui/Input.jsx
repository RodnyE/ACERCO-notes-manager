
export default function TextField ({placeholder, onInput, type, value}) {
    return (
      <input 
        className="form-control" 
        type={type}
        value={value}
        placeholder={placeholder}
        
        onInput={onInput}
      />
    );
}
