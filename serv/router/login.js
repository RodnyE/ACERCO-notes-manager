
const { DB } = require("../../config.js");
const { createUuid } = require("../utils/uuid");
const { getUser, updateUserToken } = require("../logic/user-manager"); 
const { Router } = require("express");

const router = new Router();

/**
 * Endpoint /login
 * 
 * @param {string} req.body.name 
 * @param {string} req.body.pass
 */
router.post("/login", (req, res) => {
    const body = req.body;
    const userJson = getUser({name: body.name});
    
    // verify user name
    if (!userJson) {
        return res.send({
            status: false,
            data: {
                message: "Este usuario no existe, verifique las mayúsculas y tildes.",
                type: "WRONG_NAME",
            }
        })
    }
    
    // verify user password
    if (userJson.data.pass !== body.pass) {
        return res.send({
            status: false,
            data: {
                message: "Contraseña incorrecta",
                type: "WRONG_PASS",
            }
        })
    }
    
    // all ok !
    // update token token
    updateUserToken({ userJson });
    
    // send data
    res.send({
        status: true,
        data: {
            message: "Inicio de sesión exitoso",
            token: userJson.data.token,
        }
    })
});

module.exports = router;