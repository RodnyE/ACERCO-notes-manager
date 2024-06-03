/**
 * LocalStorage Manager
 */

const stg = {
  // Check if localStorage is available
  isLocalStorageAvailable: () => {
    try {
      const x = '__localStorage__test__';
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Initializes the storage object
  init: () => {
    if (!stg.isLocalStorageAvailable()) {
      console.error('Local storage is not available');
      return;
    }

    stg.db = JSON.parse(localStorage.getItem('storage')) || {};
  },

  // Get a stored value
  // @param  {string} id - name of stored value
  // @param  {*} dfl - default value if not stored value
  // @return {*} stored value or `dfl`
  getData: (id, dfl = null) => {
    if (stg.existsData(id)) return stg.db[id];
    return dfl;
  },

  // Set a value
  // @param  {string} id - name of value
  // @param  {*} value - a value to store
  // @return {*} the `value` param
  setData: (id, value) => {
    stg.db[id] = value;
    stg.save();
    return value;
  },

  // Remove a specific value
  // @param {string} id - name of value
  removeData: id => {
    delete stg.db[id];
    stg.save();
  },

  // Verify if exist a stored value
  // @param  {string} id - name of value to verify
  // @return {boolean} if exist or not
  existsData: id => stg.db.hasOwnProperty(id),

  // Save data to local storage
  save: () => {
    localStorage.setItem('storage', JSON.stringify(stg.db));
  },

  // Clear the entire storage
  clear: () => {
    localStorage.removeItem('storage');
    stg.init();
  }
}

// Initialize the storage object
stg.init();

export default stg;
