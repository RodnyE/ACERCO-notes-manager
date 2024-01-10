
const { DB, SERV } = require("../../config");
const { createUser, getUser } = require("../logic/user-manager");
const vtmiddleware = require("../middlewares/verify-token");
const { Router } = require("express");
const fs = require("fs");
const PizZip = require("pizzip");

const router = new Router();

/**
 * Create user
 */
router.post("/admin/user", vtmiddleware(process.env.ADMIN_TOKEN));
router.post("/admin/user", (req, res) => {
    let body = req.body;
    
    createUser({
        name: body.name,
        pass: body.pass,
    });
    const userJson = getUser({ name: body.name });
    
    // write image
    fs.writeFileSync(
        DB + "/users/" + userJson.data.id + "/sign.png", 
        Buffer.from(body.sign_img.split(",")[1], 'base64')
    );
    
    res.send({
        status: true,
        data: {
            message: "Usuario creado",
            name: body.name,
            pass: body.pass,
        }
    });
});


/**
 * Get db backup
 */
router.get("/admin/backup", vtmiddleware(process.env.ADMIN_TOKEN));
router.get("/admin/backup", (req, res) => {
    let zip = new PizZip();
    
    /**
     * Save a folder in zip file
     */ 
    const saveFolderInZip = (targetFolder, currentZip) => { 
        
        fs.readdirSync(targetFolder).forEach((filename) => {
            let filePath = targetFolder + "/" + filename;
            
            // file path is a folder!
            if (fs.statSync(filePath).isDirectory()) {
                saveFolderInZip(filePath, currentZip.folder(filename));
            }
            
            // add file
            else {
                currentZip.file(
                    filename, 
                    fs.readFileSync(filePath)
                );
            }
        });
        
    }
    
    // save all
    saveFolderInZip(DB, zip);
    
    fs.writeFileSync(
        SERV + "/db.backup.zip",
        zip.generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        }),
    );
    
    res.sendFile(SERV + "/db.backup.zip");
});


module.exports = router;