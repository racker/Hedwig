/** https://www.npmjs.com/package/node-fetch */
const fetch = require('node-fetch');

/**
 * API fetch helper, single gateway to retrieve data
 * @param {string} url - url to fetch
 * @param {object} options - object consisting of
 */
function fetchAPI(url, options) {
    return fetch(url, options);
}

export { fetchAPI };