const model = require('./model');
const fetch = require('./fetch');

const ID = 1;
/**
 *
 * @param items An array of items.
 * @param fn A function that accepts an item from the array and returns a promise.
 * @returns {Promise}
 * @see http://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach
 */
function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}

/**
 * Proses one item
 * @param item
 * @return {Promise}
 */
function processItem(item) {
    return new Promise(function (resolve, reject) {
        fetch('/item-report/' + item.id)
            .then(function (report) {
                return fetch('/report/' + report.id); // Fetch report
            })
            .then(function (data) {
                item.date = data.date;
                return fetch('/generate-image/' + item.id); // Make image
            })
            .then(function (image_report) {
                return fetch('/generated-image/' + image_report.id); // Fetch image
            })
            .then(function (image) {
                item.image = image;
                return model.save(item); // Store updated element
            })
            .then(function () {
                console.log('Saved item', item); // Done
                resolve(item);
            });
    });
}

/**
 * Main code
 */
model
    .all()
    .then(function (items) { // Get Item by ID
        const threads = items.map(function (item) {
            return processItem(item);
        });
        return Promise.all(threads);
    })
    .then(function () {
        console.log('Done');
    });
