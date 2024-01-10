
/**
 * Format the date in the desired format
 * 
 * @param {string} dateString - a valid date
 * @return {string} - date in format DD/MM/YYYY
 */
const formatDocumentDate = (dateString) => {
    const date = new Date(dateString);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return day + "/" + month + "/" + year;
}

/**
 * @return {string} - date in format DDMMYYYY
 */
const formatDocumentDateId = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1; // `getMonth` method return 0 to 11 values
    let day = date.getDate();
 
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
        
    return '' + day + month + year;
}

module.exports = {
    formatDocumentDate,
    formatDocumentDateId,
}