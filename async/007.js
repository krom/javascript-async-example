const model = require('./model');
const fetch = require('./fetch');
const sleep = require('promise-sleep');


/**
 * Process report
 * @param url URL of report
 * @param maxTries number of maximum trues before Exception
 */
async function processReport(url, maxTries) {
    let tries = 1;
    let result;
    while (!(result = await fetch(url))) { // Fetch report
        if (tries++ > maxTries) return Promise.reject(new Error('Timeout of report')); // Limit of tries
        await sleep(1000); // Wait for report
    }
    return result;
}
/**
 * make and fetch report
 * @param item
 * @return {Promise.<*>}
 */
async function getInfo(item) {
    const reportInfo = await ('/item-report/' + item.id); // Make report
    return await processReport('/report/' + reportInfo, 10);
}

/**
 * make and fetch image
 * @param item
 * @return {*}
 */
async function getImage(item) {
    const imageInfo = await fetch('/generate-image/' + item.id); // Make image
    return await processReport('/generated-image/' + imageInfo, 20);
}

/**
 * Process One item
 * @param item
 */
async function processItem(item) {
    try {
        const data = await getInfo(item); // Get Updates
        item.date = data.date;
        item.image = await getImage(item); // Get Image
        await model.save(item); // Store updated element
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
async function main() {
    try {
        const items = await model.all(); // Get all items
        const results = await Promise.all(items.map(async function (item) { // Process all items
            return await processItem(item); // Process Item
        }));
        console.log('All done');
        console.log(results); // Print all results
    } catch (error) {
        console.error('Global error: ' + error.message);
    }
}

main();
