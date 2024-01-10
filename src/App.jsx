
import { useState } from "react"
import { GlobalContext } from "context"
import stg from "utils/storage.js"


import Popup from "ui/Popup"
import AdminView from "./views/Admin"
import LoginView from "./views/Login"
import GeneratorView from "./views/Generator"


export default function App () {
    
    // User state
    const [userName, setUserName] = useState(stg.getData("user-name", ""));
    const [userPass, setUserPass] = useState(stg.getData("user-pass", ""));
    const [userToken, setUserToken] = useState(stg.getData("user-token", ""));
    
    // Popup state 
    const [popupText, setPopupText] = useState("");
    const [popupShow, setPopupShow] = useState(false);
    const [popupColor, setPopupColor] = useState(false); 
    const showPopup = (text, color) => {
        setPopupText(text || "Empty");
        setPopupColor(color || "info");
        setPopupShow(true);
        window.setTimeout(() => setPopupShow(false), 3000);
    }
    
    // View state
    const [currentView, setCurrentView] = useState("LoginView");
    
    // Global context
    const context = {
        // storage manager
        userName, 
        userPass, 
        userToken, 
        setUserName: (name) => {
            setUserName(name);
            stg.setData("user-name", name);
        }, 
        setUserPass: (pass) => {
            setUserPass(pass);
            stg.setData("user-pass", pass);
        }, 
        setUserToken: (token) => {
            setUserToken(token);
            stg.setData("user-token", token);
        }, 
        
        // change page
        currentView,
        setCurrentView,
        
        // dialogs
        showPopup,
    };
    
    // Render app
    return (<GlobalContext.Provider value={context}>
        <AdminView show={currentView === "AdminView"} />
        <LoginView show={currentView === "LoginView"} />
        <GeneratorView show={currentView === "GeneratorView"} />
        
        <Popup 
            color={popupColor} 
            text={popupText} 
            show={popupShow}
        />
    </GlobalContext.Provider>)
}