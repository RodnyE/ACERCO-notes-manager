/**
 * Format the date in the desired format (DD/MM/YYYY)
 * 
 * @param {string} dateString - a valid date string in format YYYY-MM-DD
 * @return {string} - date in format DD/MM/YYYY
 * @throws {Error} - if dateString is not a valid date
 */
const formatDocumentDate = (dateString) => {
  if (!dateString) {
    throw new Error('Date string is required');
  }

  const date = new Date(dateString);

  if (isNaN(date)) {
    throw new Error('Invalid date string');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
}

/**
 * Format the date in the desired format (DDMMYYYY)
 * 
 * @param {string} [dateString=''] - a valid date string in format YYYY-MM-DD or empty string
 * @return {string} - date in format DDMMYYYY
 */
const formatDocumentDateId = (dateString = '') => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}${month}${year}`;
}

module.exports = {
  formatDocumentDate,
  formatDocumentDateId,
}
