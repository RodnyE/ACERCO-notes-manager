
/**
 * Convert Blob object to data uri string 
 * 
 * @param {Blob} blob 
 * @return {Promise} - resolve with data uri
 */
const convertBlob2DataUri = (blob) => new Promise((resolve) => {
    let blobUrl = window.URL.createObjectURL(blob);
    
    // Simulate a blob download
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = () => {
       let recoveredBlob = xhr.response;
       let reader = new FileReader();

       reader.onload = () => {
           let blobAsDataUrl = reader.result;
           resolve(blobAsDataUrl);
       }

       reader.readAsDataURL(recoveredBlob);
   };

    xhr.open('GET', blobUrl);
    xhr.send();
});

export {
    convertBlob2DataUri,
}