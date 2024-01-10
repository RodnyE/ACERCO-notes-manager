
const { DB } = require("../../config");
const { createUuid } = require("../utils/uuid");
const fs = require("fs-extra");
const Json = require("json-db");

/**
 * Create a new user
 */
const createUser = ({name, pass}) => {
    let userData = {
        name,
        id: "u-" + createUuid(),
        pass,
        token: null,
    };
    let userFolder = DB + "/users/" + userData.id;
    
    // save in users list
    let usersJson = new Json(DB + "/users.json"); 
    usersJson.data[userData.name] = userData.id;
    usersJson.write();
    
    fs.mkdirSync(userFolder);
    fs.mkdirSync(userFolder + "/docx");
    fs.writeFileSync(userFolder + "/user.json", JSON.stringify(userData));
    fs.writeFileSync(userFolder + "/docx.json", '{}'); 
    
    return true;
}

/**
 * Get user data
 * 
 * @return {Json} - user json instance
 */
const getUser = ({name, id, token}) => {
    let userId;
    
    // Get by user-id
    if (id) {
        userId = id;
    }
    // Get by token
    else if (token) {
        let tokensJson = new Json(DB + "/tokens.json");
        userId = tokensJson.data[token];
    }
    // Get by user-name
    else if (name) {
        let usersJson = new Json(DB + "/users.json");
        userId = usersJson.data[name];
    }
    
    // Not exists
    if (!userId) return null;
    
    // Found! return the user json
    return new Json(
        DB + "/users/" + userId + "/user.json"
    );
}


/**
 * Update token
 */
const updateUserToken = ({name, userJson}) => {
    let token = "t-" + createUuid(); // random token
    let tokensJson = new Json(DB + "/tokens.json");
    let _userJson;
    
    // Get user json instance
    if (userJson) {
        _userJson = userJson;
    }
    else if (name) {
        _userJson = getUser({name});
    }
    
    // Update new token and remove old token
    delete tokensJson.data[_userJson.data.token];
    tokensJson.data[token] = _userJson.data.id;
    tokensJson.write();
    
    // Update user json
    _userJson.data.token = token;
    _userJson.write();
    
    return token;
}


// export module
module.exports = {
    createUser,
    getUser,
    updateUserToken,
}