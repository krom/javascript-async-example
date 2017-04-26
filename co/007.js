const model = require('./model');
const fetch = require('./fetch');
const co = require('co');
const sleep = require('promise-sleep');


/**
 * Process report
 * @param url URL of report
 * @param maxTries number of maximum trues before Exception
 */
function *processReport(url, maxTries) {
    let tries = 1;
    let result;
    while (!(result = yield fetch(url))) { // Fetch report
        if (tries++ > maxTries) return yield Promise.reject(new Error('Timeout of report')); // Limit of tries
        yield sleep(1000); // Wait for report
    }
    return result;
}

/**
 * make and fetch report
 * @param item
 * @return {*}
 */
function * getInfo(item) {
    const reportInfo = yield ('/item-report/' + item.id); // Make report
    return yield processReport('/report/' + reportInfo, 10);
}

/**
 * make and fetch image
 * @param item
 * @return {*}
 */
function * getImage(item) {
    const imageInfo = yield fetch('/generate-image/' + item.id); // Make image
    return yield processReport('/generated-image/' + imageInfo, 20);
}

/**
 * Process One item
 * @param item
 */
function * processItem(item) {
    try {
        const data = yield getInfo(item); // Get Updates
        item.date = data.date;
        item.image = yield getImage(item); // Get Image
        yield model.save(item); // Store updated element
        console.log('Saved item', item); // Done
        return item; // Result updated item
    } catch (error) {
        console.error(item, error.message); // Process error for item
        return error;
    }
}

/**
 * Main code block
 */
co(function *() {
    try {
        const items = yield model.all(); // Get all items
        const results = yield items.map(function (item) { // Process all items
            return co(processItem(item)); // Process Item
        });
        console.log('All done');
        console.log(results); // Print all results
    } catch (error) {
        console.error('Global error: ' + error.message);
    }
});