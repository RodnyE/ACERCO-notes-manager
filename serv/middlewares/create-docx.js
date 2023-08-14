
// Import necessary modules
const cfg = require("../../config"); 
const { createDateId } = require("../utils/uuid");

const fs = require("fs"); 
const PizZip = require("pizzip"); // Library for manipulating .docx files
const Docxtemplater = require("docxtemplater"); // Library for generating .docx files
const ImageModule = require("docxtemplater-image-module"); // Module for handling images in .docx files

// Middleware function to create a .docx file
const createDocxMiddleware = (req, res, next) => {
    const body = req.body;
    
    // Define variables for the template rendering
    const templateRender = {
        entity: body.entity,
        code: body.code || "RG-00-01-04",
        author: body.author,
        sign_image: cfg.ACERCO_SIGN, // Path to the signature image
        
        // Add empty notes if the provided notes array is less than 20 elements
        notes: body.notes.concat(
            Array(20 - body.notes.length).fill("")
        ),
        
        // Format the date in the desired format
        date: (()=>{
            const date = new Date(body.date);
            
            let year = date.getFullYear();
            let month = date.getMonth() + 1;  
            let day = date.getDate() + 1;
            
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            
            return day + "/" + month + "/" + year;
        })(),
    };
    
    // Generate a unique document ID
    const docId = createDateId(body.date) + "-" + body.alias;
    
    // Define input and output paths for the .docx file
    const inputPath = cfg.ACERCO_TEMPLATE; // Path to the input template file
    const output = {
        id: docId,
        docx: cfg.ACERCO_DOCX + "/" + docId + ".docx", // Path to the output .docx file
        pdf: null, // Placeholder for the path to the output .pdf file
    };
    
    // Load the template file in binary data format
    const zip = new PizZip(fs.readFileSync(inputPath, "binary"));
    
    // Create a new instance of the Docxtemplater library
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [new ImageModule({
            centered: false,
            getImage: (tagValue, tagName) => fs.readFileSync(tagValue),
            getSize: () => [200, 115],
        })]
    });

    // Render the template with the provided data
    doc.render(templateRender);
    
    // Save the generated .docx file
    fs.writeFileSync(
        output.docx,
        doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        }),
    );
    
    // Store the output information in the request object for further use
    if (!req.middleware) req.middleware = {};
    req.middleware.docOutput = output;
    
    next(); // Proceed to the next middleware
};

module.exports = createDocxMiddleware;