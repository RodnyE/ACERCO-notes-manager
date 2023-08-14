const cfg = require("../config.js");

const express = require("express");
const fs = require("fs");
const path = require("path");
const requestConvertToPdf = require("./utils/docx-to-pdf"); // Function to convert .docx to .pdf


const app = express(); 
const createDocxMiddleware = require("./middlewares/create-docx");


// Configure middlewares
app.use(express.json()); // Parse JSON in the request body
app.post("/api/acerco-notes/docx", createDocxMiddleware); // Create a .docx file
app.post("/api/acerco-notes/pdf", createDocxMiddleware); // Create a .docx file and convert it to .pdf


// Start the server and listen on the specified port
app.listen(cfg.PORT, () => {
    console.log("Running in port " + cfg.PORT);
});


const docsPath = {}; // Store the paths of generated documents

// Download generated .docx 
app.get("/api/acerco-notes/docx/:id", (req, res) => res.sendFile(docsPath[req.params.id].docx));
app.get("/api/acerco-notes/pdf/:id", (req, res) => res.sendFile(docsPath[req.params.id].pdf));

// Generate .docx files
app.post("/api/acerco-notes/docx", (req, res) => {
    const output = req.middleware.docOutput;
    const docId = output.id;
    
    docsPath[docId] = {
        docx: output.docx, // Path to the generated .docx file
        pdf: null, // Placeholder for the path to the generated .pdf file
    };
    
    res.send({
        status: true,
        data: {
            message: "DOCX generado exitosamente!",
            id: docId, // ID of the generated document
        }
    });
});

// Generate .pdf files
app.post("/api/acerco-notes/pdf", (req, res) => {
    const output = req.middleware.docOutput;
    const docId = output.id;
    
    docsPath[docId] = {
        docx: output, // Path to the generated .docx file
        pdf: cfg.ACERCO_PDF + "/" + docId + ".pdf", // Path to the generated .pdf file
    };
    
    // Use CloudConvert API to convert the .docx file to .pdf
    requestConvertToPdf(
        path.join(req.headers.host, "/api/acerco-notes/docx", docId), // URL of the file to convert
        output.pdf, // Path to the generated .pdf file
    )
    .then(() => {
        res.send({
            status: true,
            data: {
                message: "PDF generado exitosamente!", // Successful message
                id: docId // ID of the generated document
            }
        });
    })
    .catch(({code, message}) => {
        res.send({
            status: false,
            error: {
                message,
                code,
            },
        })
    });
    
});

//
// Serve static pages
//
if (!cfg.isProduction) {
    // Development mode - Use Webpack server for serving static files
    const webpackRouter = require('./webpack-router');
    app.use("/", webpackRouter);
    console.log("Using Webpack server for development mode...");
}
else {
    // Production mode - Use static server for serving static files
    app.use("/", express.static(cfg.DIST));
    console.log("Using static server for production mode...");
}