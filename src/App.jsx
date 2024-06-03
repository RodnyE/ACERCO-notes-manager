import { useState, useEffect } from "react"
import { GlobalContext } from "context"
import stg from "utils/storage.js"

import Popup from "ui/Popup"
import AdminView from "./views/Admin"
import LoginView from "./views/Login"
import GeneratorView from "./views/Generator"

type PopupProps = {
  color: string;
  text: string;
  show: boolean;
}

export default function App () {
  // User state
  const [userName, setUserName] = useState<string>(stg.getData("user-name", ""));
  const [userPass, setUserPass] = useState<string>(stg.getData("user-pass", ""));
  const [userToken, setUserToken] = useState<string>(stg.getData("user-token", ""));

  // Popup state 
  const [popupText, setPopupText] = useState<string>("");
  const [popupShow, setPopupShow] = useState<boolean>(false);
  const [popupColor, setPopupColor] = useState<string>("");

  const showPopup = (text: string, color: string) => {
    setPopupText(text || "Empty");
    setPopupColor(color || "info");
    setPopupShow(true);
    window.setTimeout(() => setPopupShow(false), 3000);
  }

  // View state
  const [currentView, setCurrentView] = useState<string>("LoginView");

  // Global context
  const context = {
    // storage manager
    userName, 
    userPass, 
    userToken, 
    setUserName: (name: string) => {
      setUserName(name);
      stg.setData("user-name", name);
    }, 
    setUserPass: (pass: string) => {
      setUserPass(pass);
      stg.setData("user-pass", pass);
    }, 
    setUserToken: (token: string) => {
      setUserToken(token);
      stg.setData("user-token", token);
    }, 
    
    // change page
    currentView,
    setCurrentView,
    
    // dialogs
    showPopup,
  };

  useEffect(() => {
    if (userToken) {
      setCurrentView("GeneratorView");
    }
  }, [userToken]);

  return (
    <GlobalContext.Provider value={context}>
      {!userToken && <LoginView show={currentView === "LoginView"} />}
      {userToken && <GeneratorView show={currentView === "GeneratorView"} />}
      {userToken && <AdminView show={currentView === "AdminView"} />}

      <Popup 
        color={popupColor} 
        text={popupText} 
        show={popupShow}
      />
    </GlobalContext.Provider>
  )
}
