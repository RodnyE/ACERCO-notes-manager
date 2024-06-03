const { DB } = require("../../config.js");
const { createUuid } = require("../utils/uuid");
const { getUser, updateUserToken } = require("../logic/user-manager"); 
const { Router } = require("express");
const { body, validationResult } = require('express-validator');

const router = new Router();

/**
 * Endpoint /login
 * 
 * @param {string} req.body.name 
 * @param {string} req.body.pass
 */
const validateLogin = [
  body('name').notEmpty().withMessage('Name is required'),
  body('pass').notEmpty().withMessage('Password is required'),
];

router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;
  let userJson;
  try {
    userJson = await getUser({name: body.name});
  } catch (err) {
    return res.send({
      status: false,
      data: {
        message: "Error al verificar el usuario, intente nuevamente.",
        type: "DATABASE_ERROR",
      }
    })
  }

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
  try {
    await updateUserToken({ userJson });
  } catch (err) {
    return res.send({
      status: false,
      data: {
        message: "Error al actualizar el token, intente nuevamente.",
        type: "DATABASE_ERROR",
      }
    })
  }

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
