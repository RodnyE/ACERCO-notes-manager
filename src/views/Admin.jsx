
import { useState, useContext } from "react"
import { GlobalContext } from "context"

import View from "ui/View"
import Button from "ui/Button"
import TextField from "ui/TextField"

import http from "utils/http"
import { convertBlob2DataUri } from "utils/file"

export default function AdminView ({show}) {
    const { showPopup } = useContext(GlobalContext);
    const [adminToken, setAdminToken] = useState("");
    const [nameField, setNameField] = useState("");
    const [passField, setPassField] = useState("");
    const [signImgField, setSignImgField] = useState("");
    
    /**
     * Create a new user
     */
    const requestCreateUser = () => {
        http.post({
            url: "/admin/user",
            headers: {"Authorization": "Bearer " + adminToken},
            body: {
               name: nameField, 
               pass: passField, 
               sign_img: signImgField,
            },
        })
        .then(({data, status}) => {
            showPopup(data.message, status?"success":"danger");
        })
    }
    
    return (
      <View show={show} className="p-3">
        <TextField
            placeholder="Admin Key..."
            value={adminToken}
            onInput={(e) => setAdminToken(e.target.value)}
        />
        <hr/>
        <hr/>
        <h2> Create user </h2>
        <TextField
            placeholder="user-name..."
            value={nameField}
            onInput={(e) => setNameField(e.target.value)}
        />
        <TextField
            placeholder="user-pass..."
            value={passField}
            onInput={(e) => setPassField(e.target.value)}
        /> 
        <TextField 
            className="my-2"
            type="file"
            onInput={(e) => { 
                convertBlob2DataUri(e.target.files[0])
                .then(uri => setSignImgField(uri))
            }}
        />
        <Button 
            disabled={!nameField || !passField || !signImgField}
            onClick={requestCreateUser}
        >
            Create user
        </Button>
        <hr/>
        <hr/>
        <hr/>
        <Button
          onClick={()=>{
              showPopup("Descargando db...", "info");
              http.getDownload({
                  url: "/admin/backup",
                  fileName: "acerco.backup.zip",
                  headers: {
                      "Authorization": "Bearer " + adminToken
                  }
              })
              .then(() => {
                  showPopup("Listo!");
              })
          }}
        > 
          Download db backup
        </Button>
        
      </View>
    )
}