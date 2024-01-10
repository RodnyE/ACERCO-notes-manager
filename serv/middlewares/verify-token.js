
const { DB } = require("../../config");
const { getUser } = require("../logic/user-manager");

/**
 * Verify token authentication 
 * 
 * @param {string} requiredToken - validate only by a specific token
 * @return {Function} - express middleware
 */
const verifyTokenMiddleware = (requiredToken) => (req, res, next) => {
    let token = req.get("Authorization") || "Bearer null";
    token = token.split(" ")[1];
    
    // Validate by specific token (admin)
    if (requiredToken) {
        if (requiredToken === token) {
            next();
            return;
        }
        else {
            res.send({
                status: false,
                data: {
                    message: "Autenticación no válida o expiró"
                }
            });
            return;
        } 
    }
    
    // Validate by user token
    else {
        let userJson = getUser({ token });
        
        if (userJson) {
            req.userJson = userJson;
            next();
            return;
        }
        else {
            res.send({
                status: false,
                data: {
                    message: "Autenticación no válida o expiró"
                }
            });
            return;
        } 
    } 
    
}

module.exports = verifyTokenMiddleware;