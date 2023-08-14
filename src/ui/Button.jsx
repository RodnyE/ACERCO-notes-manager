
export default function Button ({onClick, children}) {
    return (
      <div onClick={onClick} className="btn btn-primary"> {children} </div>
    )
}