/*start with two...may add more later

read a value from local storage and parse it as JSON @param {string} key
The key under which the value is stored in LS
@return {array} The value as an array of objects */
const readFromLS = lskey => localStorage.getItem(lskey);

/*
write an array of objects to local storage under the provided key @param {string} key The key under which the value is stored under in LS
* @param {array} data The information to be stored as an array of objects. Must be serialized.
*/
const writeToLS = (lskey, list) =>  localStorage.setItem(lskey, list);

// remove selected item from localStorage
const removeFromLS = (lskey, id) => localStorage.removeItem(lskey, id);



export { readFromLS, writeToLS, removeFromLS };