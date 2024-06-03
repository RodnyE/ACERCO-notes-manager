const { DB } = require("../../config");
const { getUser } = require("../logic/user-manager");

/**
 * Verify token authentication 
 * 
 * @param {string} requiredToken - validate only by a specific token
 * @return {Function} - express middleware
 */
const verifyTokenMiddleware = (requiredToken = '') => async (req, res, next) => {
  try {
    let token = req.get("Authorization") || "Bearer null";
    token = token.split(" ")[1];

    // Validate requiredToken parameter
    if (typeof requiredToken !== 'string' || requiredToken.trim() === '') {
      return res.status(400).send({
        status: false,
        data: {
          message: 'requiredToken parameter is missing or invalid',
        },
      });
    }

    // Validate by specific token (admin)
    if (requiredToken === token) {
      return next();
    }

    // Validate by user token
    let user = null;
    if (token !== 'Bearer null') {
      user = await getUser({ token });
    }

    if (user) {
      req.user = user;
      return next();
    }

    // Return a 401 status code for unauthorized requests
    return res.status(401).send({
      status: false,
      data: {
        message: "Autenticación no válida o expiró",
      },
    });

  } catch (error) {
    // Handle errors thrown by getUser function
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).send({
        status: false,
        data: {
          message: "Autenticación no válida o expiró",
        },
      });
    }

    // Handle other errors
    return res.status(500).send({
      status: false,
      data: {
        message: 'Internal server error',
      },
    });
  }
}

module.exports = verifyTokenMiddleware;
