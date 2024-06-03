const http = {
  /**
   * Post fetch method
   *
   * @param {string} url - The URL to send the request to.
   * @param {Object} body - The object data to send.
   * @param {Object} headers - The headers data to send.
   * @returns {Promise} - A promise that resolves to the JSON response.
   */
  post({url, body, headers = {}}) {
    headers["Content-Type"] = "application/json";

    return fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .catch(error => {
        console.error("Error in post request:", error);
        throw error;
      });
  },

  /**
   * Get HTTP method to download file
   *
   * @param {string} url - The URL to send the request to.
   * @param {string} fileName - The name of the file to download.
   * @param {Object} headers - The headers data to send.
   * @returns {Promise} - A promise that resolves to the downloaded file.
   */
  getDownload({url, fileName, headers = {}}) {
    headers["Content-Type"] = "application/octet-stream";

    return fetch(url, {
      method: "GET",
      headers,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.blob();
      })
      .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = fileName || url;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return Promise.resolve();
      })
      .catch(error => {
        console.error("Error in getDownload request:", error);
        throw error;
      });
  },
};

export default http;
