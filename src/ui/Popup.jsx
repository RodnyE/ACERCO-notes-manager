
export default function Popup ({
    show,
    color,
    text,
    children,
}) {
    return (
      <div 
        style={{
            position: "fixed",
            top: 0,
            right: 0,
        }}
        className={
            "alert shadow-sm"
            + (color ? " alert-" + color : "")
            + (!show ? " d-none" : "")
        }
      >
        {text || children}
      </div>
    )
}