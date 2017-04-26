/**
 * Fetch HTTP resource
 * @param url url of resource
 * @param cb Callback function for pushing result
 */
module.exports = function (url, cb) {
    console.log('fetch: ' + url);
    cb(null, {
        url: url,
        date: new Date()
    });
};

