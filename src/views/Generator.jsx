import { useState, useContext } from "react" 
import { GlobalContext } from "context"

import View from "ui/View"
import Navbar from "ui/Navbar"
import TextField from "ui/TextField"
import Button from "ui/Button"

import http from "utils/http.js"
import stg from "utils/storage.js"

import acercoImg from "assets/acercologo.svg"

export default function GeneratorView({ show }) {
  const { userName, userToken } = useContext(GlobalContext);
  const [entityValue, setEntityValue] = useState(stg.getData("entity", ""));
  const [aliasValue, setAliasValue] = useState(stg.getData("doc-alias", ""));
  const [notesValue, setNotesValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to submit data
  const submitDocData = async () => {
    const body = {
      date: new Date(dateValue).toString(),
      notes: notesValue.split("\n"),
      entity: entityValue,
      alias: aliasValue,
    }; 

    setLoading(true);
    try {
      const { data, status } = await http.post({
        url: "/api/docx",
        body,
        headers: {
          "Authorization": "Bearer " + userToken,
        }
      });

      if (!status) {
        showPopup(data.message, "danger");
        return;
      } 

      // download file
      showPopup("Descargando " + data.id + " ...", "info");

      await http.getDownload({
        url: "/api/docx/file/" + data.id, 
        fileName: data.id,
        headers: {"Authorization": "Bearer " + userToken}
      });

      showPopup("Listo !", "success");
    } catch (error) {
      showPopup("Error al generar el documento", "danger");
    }
    setLoading(false);
  }

  // Validate date input
  const validateDate = (date) => {
    const currentDate = new Date();
    return date <= currentDate;
  }

  // Render 
  return (
    <View show={show}>
      {userToken &&
        <Navbar>
          <img className="w-25" src={acercoImg}/>
        </Navbar>
      }

      <div className="p-4 d-flex flex-column align-items-center">
        <h3 className="mt-3"> Bienvenido/a {userName}!</h3>
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
            onInput={e => {
              if (validateDate(new Date(e.target.value + "T01:00"))) {
                setDateValue(e.target.value + "T01:00");
              }
            }} 
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
          <Button onClick={submitDocData} disabled={loading}> 
              {loading ? "Descargando..." : "Descargar DOCX
