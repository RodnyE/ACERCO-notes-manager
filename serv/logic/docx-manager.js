
const { DB, ACERCO_TEMPLATE, ACERCO_SIGN } = require("../../config");
const { formatDocumentDate, formatDocumentDateId } = require("../utils/date");
const { createUuid } = require("../utils/uuid");

const fs = require("fs");
const Json = require("json-db");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module");


/**
 * Get docx json
 */
const getDocxJson = ({userJson}) => {
    return new Json(DB + "/users/" + userJson.data.id + "/docx.json");
}



/**
 * Create a new document data
 * 
 * @param {Json} userJson
 * @param {Array<string>} notes
 * @param {string} entity
 * @param {string} code
 * @param {string} date
 * @param {string} alias
 */
const createDocx = ({ userJson, entity, code, notes, date, alias }) => {
    const docxJson = getDocxJson({ userJson });
    const docId = formatDocumentDateId(date) + "-" + alias + ".docx";
    const data =  {
        entity: entity || userJson.data.entity, 
        code: code || "RG-00-01-04",
        notes,
        date: new Date(date).toString(),
    };
    
    docxJson.data[docId] = data;
    docxJson.write();
    
    return docId;
}



/** 
 * Create temporary word document in DOCX format
 * 
 * @param {Json} userJson
 * @param {string} docId - document name 
 */
const createDocxDocument = ({userJson, docId}) => {
    
    // docx data
    const data = getDocxJson({ userJson }).data[docId];
    const docPath = DB + "/users/" + userJson.data.id + "/docx/" + docId;
    
    //
    const templateRender = {
        author: userJson.data.name,
        sign_image: DB + "/users/" + userJson.data.id + "/sign.png", // Path to the signature image
        entity: data.entity || userJson.data.entity,
        date: formatDocumentDate(data.date),
        code: data.code,
        
        // Add empty notes if the provided notes array is less than 20 elements
        notes: data.notes.concat(
            Array(20 - data.notes.length).fill("")
        ),
    };
    
    // Load the template file in binary data format
    const zip = new PizZip(fs.readFileSync(ACERCO_TEMPLATE, "binary"));
    
    // Create a new instance of the Docxtemplater library
    const renderer = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [new ImageModule({
            centered: false,
            getImage: (tagValue, tagName) => fs.readFileSync(tagValue),
            getSize: () => [200, 115],
        })]
    });

    // Render the template with the provided data
    renderer.render(templateRender);
    
    // Save the generated .docx file
    fs.writeFileSync(
        docPath,
        renderer.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        }),
    );
}



// export module
module.exports = {
    getDocxJson,
    createDocx,
    createDocxDocument,
}