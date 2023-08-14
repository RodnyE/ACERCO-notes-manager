
module.exports = {
    PORT: 3000,
    isProduction: process.env.NODE_ENV === "production",
    
    DIR: __dirname,
    SERV: __dirname + "/serv",
    DIST: __dirname + "/dist",
    PUBLIC: __dirname + "/public",
    SRC: __dirname + "/src",
    
    ACERCO_TEMPLATE: __dirname + "/output/doc-acerco-template.docx",
    ACERCO_SIGN: __dirname + "/output/sign.png",
    ACERCO_DOCX: __dirname + "/output/docx",
    ACERCO_PDF: __dirname + "/output/pdf",
};