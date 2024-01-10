
import { useState, useContext } from "react"
import { GlobalContext } from "context"

import View from "ui/View"
import TextField from "ui/TextField"
import Button from "ui/Button"

import http from "utils/http"
import stg from "utils/storage"

import acercoImg from "assets/acercologo.svg"

export default function LoginView ({show}) {
    // get globals
    const {
        userName, setUserName,
        userPass, setUserPass,
        userToken, setUserToken,
        setCurrentView, 
        showPopup,
    } = useContext(GlobalContext);
    const [formDisabled, setFormDisabled] = useState(false);
    const [formInvalid, setFormInvalid] = useState(false);
    
    /**
     * verify account
     */
    const requestLogin = () => {
        
        // admin login
        if (userName === "admin" && userPass === "admin") {
            return setCurrentView("AdminView");
        }
        
        setFormDisabled(true);
        http.post({
            url: "/login",
            body: {
                name: userName,
                pass: userPass,
            }
        })
        .then(body => {
            if (body.status) {
                showPopup(body.data.message, "success");
                setUserToken(body.data.token);
                setCurrentView("GeneratorView");
            }
            else {
                if (body.data.type === "WRONG_PASS") setFormInvalid("pass-field");
                if (body.data.type === "WRONG_NAME") setFormInvalid("name-field");
                
                showPopup(body.data.message, "danger"); 
                setFormDisabled(false);
            }
        });
    }
    
    return ( 
      <View show={show}>
        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
          
        {/* Form */}
        <div className="bg-white rounded p-3 d-flex flex-column">
                
            {/* logo */}
            <img
              src={acercoImg}
              className="mb-3 align-self-center" 
              style={{
                height: "2em"
              }}
            /> 
                
            {/* fields */}
            <div>
                <div className="ps-0 ms-0 my-2 form-group" >
                    <label>Usuario: </label>
                    <TextField
                      disabled={formDisabled}
                      onInput={e => setUserName(e.target.value)} 
                      value={userName} 
                      color={formInvalid === "name-field" ? "danger" : "normal"}
                    /> 
                </div>
                <div className="ps-0 ms-0 my-2 form-group" >
                    <label>Llave: </label>
                    <TextField 
                      type="password"
                      disabled={formDisabled}
                      onInput={e => setUserPass(e.target.value)} 
                      value={userPass} 
                      color={formInvalid === "pass-field" ? "danger" : "normal"}
                    /> 
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <Button 
                  onClick={()=>requestLogin()}
                  disabled={formDisabled || (userName.length < 3 || userPass.length === 0)}
                > 
                  Entrar 
                </Button>
            </div>
            
          
        </div>
        </div>
      </View>
    )
}