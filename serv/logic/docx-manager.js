const { DB, ACERCO_TEMPLATE, ACERCO_SIGN } = require("../../config");
const { formatDocumentDate, formatDocumentDateId } = require("../utils/date");
const { createUuid } = require("../utils/uuid");
const fs = require("fs");
const Json = require("json-db");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module");

const errorHandler = (error, message) => {
  console.error(`${message}: ${error.message}`);
  process.exit(1);
};

const validateParams = (params) => {
  if (!params.userJson || !params.entity || !params.code || !params.date || !params.alias) {
    throw new Error("Missing required parameters");
  }
};

/**
 * Get docx json
 * @param {Object} userJson
 * @returns {Json}
 */
const getDocxJson = ({ userJson }) => {
  try {
    return new Json(DB + "/users/" + userJson.data.id + "/docx.json");
  } catch (error) {
    errorHandler(error, "Failed to create docx json instance");
  }
};

/**
 * Create a new document data
 * @param {Object} params
 * @param {Json} params.userJson
 * @param {string} params.entity
 * @param {string} params.code
 * @param {string[]} params.notes
 * @param {string} params.date
 * @param {string} params.alias
 * @returns {string}
 */
const createDocx = ({ userJson, entity, code, notes, date, alias }) => {
  validateParams({ userJson, entity, code, date, alias });

  const docxJson = getDocxJson({ userJson });
  const docId = formatDocumentDateId(date) + "-" + alias + ".docx";
  const data = {
    entity: entity || userJson.data.entity,
    code: code || "RG-00-01-04",
    notes,
    date: new Date(date).toString(),
  };

  docxJson.data[docId] = data;
  docxJson.write();

  return docId;
};

/**
 * Create temporary word document in DOCX format
 * @param {Object} params
 * @param {Json} params.userJson
 * @param {string} params.docId
 */
const createDocxDocument = ({ userJson, docId }) => {
  if (!getDocxJson({ userJson }).data[docId]) {
    throw new Error("Docx data not found");
  }

  const data = getDocxJson({ userJson }).data[docId];
  const docPath = DB + "/users/" + userJson.data.id + "/docx/" + docId;

  const templateRender = {
    author: userJson.data.name,
    sign_image: DB + "/users/" + userJson.data.id + "/sign.png",
    entity: data.entity || userJson.data.entity,
    date: formatDocumentDate(data.date),
    code: data.code,
    notes: data.notes.concat(Array(20 - data.notes.length).fill("")),
  };

  const zip = new PizZip(fs.readFileSync(ACERCO_TEMPLATE, "binary"));
  const renderer = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    modules: [
      new ImageModule({
        centered: false,
        getImage: (tagValue, tagName) => fs.readFileSync(tagValue),
        getSize: () => [200, 115],
      }),
    ],
  });

  renderer.render(templateRender);

  fs.writeFileSync(
    docPath,
    renderer.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" })
  );
};

module.exports = {
  createDocx,
  createDocxDocument,
};
