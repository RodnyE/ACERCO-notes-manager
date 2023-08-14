const cfg = require("../../config");
const fs = require('fs');
const CloudConvert = require("cloudconvert");


function requestConvertToPdf (wordFileUrl, outputPdfFilePath) {
  const cloudConvert = new CloudConvert(cfg.CLOUDCONVERT_API_KEY);

  return cloudConvert.jobs.create({
        tasks: {
            'import-my-file': {
                operation: 'import/url',
                url: wordFileUrl
            },
            'convert-my-file': {
                operation: 'convert',
                input: 'import-my-file',
                output_format: 'pdf',
            },
            'export-my-file': {
                operation: 'export/url',
                input: 'convert-my-file'
            }
        }
    })
    .then(job => new Promise((resolve, reject) => {
        // Wait for job completion
        cloudConvert.jobs.wait(job.id).then(job => {
            const file = this.cloudConvert.jobs.getExportUrls(job)[0];
            const writeStream = fs.createWriteStream(outputPdfFilePath);
            
            axios.get(file.url, {
                responseType: 'stream'
            })
            .then(response => {
                response.data.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            })
            .catch(reject)
        })
    }));
}

module.exports = requestConvertToPdf;