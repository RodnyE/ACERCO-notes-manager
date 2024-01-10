

export default function Navbar ({children}) {
    return (
      <div className="navbar bg-dark text-light">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    )
}