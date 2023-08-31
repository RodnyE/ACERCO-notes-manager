
import { useState } from "react"
import {
    View,
    Navbar, 
    TextField,
    Button,
} from "ui"
import http from "utils/http.js"
import stg from "utils/storage.js"

import acercoImg from "assets/acercologo.svg"


export default function GeneratorView ({show}) {
    const [entityValue, setEntityValue] = useState(stg.getData("entity", ""));
    const [authorValue, setAuthorValue] = useState(stg.getData("author", ""));
    const [aliasValue, setAliasValue] = useState(stg.getData("doc-alias", ""));
    const [notesValue, setNotesValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    
    // Function to submit data
    const submitDocData = () => {
        const body = {
            date: new Date(dateValue).getTime(),
            notes: notesValue.split("\n"),
            author: authorValue,
            entity: entityValue,
            alias: aliasValue,
        };
        
        http.post({
            url: "/api/acerco-notes/docx",
            body,
        })
        .then(({data}) => {
            location.href = "/api/acerco-notes/docx/" + data.id
        });
    }
    
    // Render 
    return (
      <View show={show}>
        <Navbar>
          <img className="w-25" src={acercoImg}/>
        </Navbar>
        
        
        <div className="p-4 d-flex flex-column align-items-center">
          <h3 className="mt-3"> Bienvenido/a {authorValue.split(" ")[0]}!</h3>
          <p> 
            Este es un asistente de generación de reportes diarios desde la comodidad
            de su teléfono. Solo rellene los campos y toque el botón "Descargar" para generar el documento correspondiente
          </p>
          
          
          <div className="form-group" >
            <label>Entidad: </label>
            <TextField 
                onInput={e => {
                    setEntityValue(e.target.value);
                    stg.setData("entity", e.target.value);
                }} 
                value={entityValue} 
            /> 
          </div>
          
          {/* get name */}
          <div className="form-group" >
            <label>Nombre: </label>
            <TextField 
                onInput={e => {
                    setAuthorValue(e.target.value);
                    stg.setData("author", e.target.value);
                }} 
                value={authorValue}
            />
          </div>
          
          {/* get alias doc name */}
          <div className="form-group" >
            <label>Doc alias: </label>
            <TextField 
                onInput={e => {
                    setAliasValue(e.target.value);
                    stg.setData("doc-alias", e.target.value);
               }} 
               value={aliasValue} 
            />
          </div>
          
          {/* get date */}
          <div className="form-group" >
            <label>Fecha: </label>
            <TextField 
                type="date"
                onInput={e => setDateValue(e.target.value)} 
            />
          </div>
          
          {/* get notas*/}
          <div className="form-group flex-column align-items-start">
            <label>Reporte: </label>
            <textarea 
                className="form-control"
                rows="8" 
                onInput={e => setNotesValue(e.target.value)} 
            ></textarea>
          </div>
          
          {/* summit */}
          <div className="m-2 w-100 d-flex justify-content-end">
            <Button onClick={submitDocData}> 
                Descargar DOCX 
            </Button>
          </div>
        </div>
        
      </View>
    )
}