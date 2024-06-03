const { DB } = require("../../config");
const { getDocxJson } = require("../logic/docx-manager");
const verifyToken = require("../middlewares/verify-token");
const { Router } = require("express");
const router = new Router();

router.get("/api/user-sign.png", verifyToken, (req, res) => {
  let userData = req.userJson;
  if (!userData) {
    return res.status(404).json({ error: "User data not found" });
  }
  
  res.sendFile(DB + "/users/" + userData.id + "/sign.png", (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send file" });
    }
  });
});

module.exports = router;
