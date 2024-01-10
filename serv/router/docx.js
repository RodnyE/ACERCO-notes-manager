
const { DB } = require("../../config");
const { createDocx, createDocxDocument } = require("../logic/docx-manager");
const verifyTokenMiddleware = require("../middlewares/verify-token");
const { Router } = require("express");

const router = new Router();

/**
 * POST: /api/docx endpoint
 * Create new document data from user input
 * 
 * @param {string} req.body.token - user token authentication 
 * @param {string} req.body.entity
 * @param {string} req.body.alias
 * @param {string} req.body.date
 * @param {Array<string>} req.body.notes
 */
router.post("/api/docx", verifyTokenMiddleware());
router.post("/api/docx", (req, res) => {
    const body = req.body;
    const userJson = req.userJson;
    
    let docId = createDocx({
        userJson,
        entity: body.entity,
        alias: body.alias,
        notes: body.notes,
        date: body.date,
        code: null,
    });
    
    // send document name
    res.send({
        status: true,
        data: {
            message: "DOCX generado exitosamente!",
            id: docId, // ID of the generated document
        }
    });
});



/**
 * Get list of docx
 */
router.get("/api/docx", verifyTokenMiddleware());
router.get("/api/docx", (req, res) => {
    let userJson = req.userJson;
    let docxMap = getDocxJson({userJson}).data;
    
    let docxList = Object.keys(docxMap).map((docId) => docxMap[docId]);
    docxList.sort((a, b) => {
        let date1 = new Date(a.date).getTime();
        let date2 = new Date(b.date).getTime();
        return a - b;
    });
    
    res.send({
        status: true,
        data: {
            list: docxList,
        }
    });
});


/**
 * POST: /api/docx endpoint
 * Create new document data from user input
 * 
 * @param {string} req.body.entity
 * @param {string} req.body.alias
 * @param {string} req.body.date
 * @param {Array<string>} req.body.notes
 */
router.get("/api/docx/file/:id", verifyTokenMiddleware());
router.get("/api/docx/file/:id", (req, res) => {
    const userJson = req.userJson;
    const docId = req.params.id;
    
    createDocxDocument({ userJson, docId });
    res.sendFile(DB + "/users/" + userJson.data.id + "/docx/" + docId);
});

module.exports = router;