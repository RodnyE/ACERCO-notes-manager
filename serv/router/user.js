
const { DB } = require("../../config");
const { getDocxJson } = require("../logic/docx-manager");
const vtmiddleware = require("../middlewares/verify-token");
const { Router } = require("express");
const router = new Router();

router.get("/api/user-sign.png", vtmiddleware());
router.get("/api/user-sign.png", (req, res) => {
    let userData = req.userJson;
    res.sendFile(DB + "/users/" + userData.id + "/sign.png");
});

module.exports = router;