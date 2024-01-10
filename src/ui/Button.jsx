
export default function Button ({onClick, children, disabled}) {
    return (
      <div 
        onClick={onClick} 
        className={
          "btn btn-primary time-2" 
          + (disabled ? " disabled" : "")
        }
      > 
        {children} 
      </div>
    )
}