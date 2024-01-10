
// get .env file into process.env object
require("dotenv").config(); 

module.exports = {
    PORT: process.env.PORT || 3000,
    isProduction: process.env.NODE_ENV === "production",
    
    DIR: __dirname,
    SERV: __dirname + "/serv",
    DIST: __dirname + "/dist",
    PUBLIC: __dirname + "/public",
    SRC: __dirname + "/src",
    DB: __dirname + "/serv/db",
    
    ACERCO_TEMPLATE: __dirname + "/serv/db/doc-acerco-template.docx",
    ACERCO_SIGN: __dirname + "/serv/db/sign.png",
    ACERCO_DOCX: __dirname + "/serv/db/docx", 
};