
import { useState } from "react"
import { GlobalContext } from "context"
import stg from "utils/storage.js"

import GeneratorView from "./views/Generator"


export default function App () {
    // User state
    const [userName, setUserName] = useState(stg.getData("user-name", ""));
    const [userPass, setUserPass] = useState(stg.getData("user-pass", ""));
    const [userToken, setUserToken] = useState(stg.getData("user-token", ""));
    
    // Global context
    const context = {
        userName,  setUserName,
        userPass,  setUserPass,
        userToken, setUserToken,
    };
    
    // Render app
    return (
        <GlobalContext.Provider value={context}>
            <GeneratorView show={true} />
        </GlobalContext.Provider>
    )
}