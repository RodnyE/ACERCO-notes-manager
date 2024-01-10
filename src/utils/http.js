
const http = {
    
    /**
     * Post fetch method
     * 
     * @param {string} url 
     * @param {Object} body - object data to send
     * @param {Object} headers - headers data to send
     */
    post ({url, body, headers = {}}) { 
        headers["Content-Type"] = "application/json";
        
        return fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
        .then(res => res.json())
    },
    
    /**
     * Get HTTP method to download file
     * 
     * @param {string} url
     * @param {string} fileName - file name in download folder
     * @param {Object} headers
     */
    getDownload ({url, fileName, headers = {}}) {
        return fetch(url, {
            method: "GET",
            headers,
        })
        .then(res => res.blob())
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = fileName || url;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again          
            
            // continue promise chain
            return Promise.resolve();
        })
    }
};

export default http;