/**
 * Fetch HTTP resource
 * @param url url of resource
 * @return {Promise}
 */
module.exports = function (url) {
    return new Promise(function (resolve, reject) {
        console.log('fetch: ' + url);
        resolve({
            url: url,
            date: new Date()
        });
    });
};