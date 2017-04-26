const model = require('./model');
const fetch = require('./fetch');
const co = require('co');
const sleep = require('promise-sleep');

co(function *() {
    const items = yield model.all(); // Get all items
    for (let item of items) { // process all items
        const reportInfo = yield fetch('/item-report/' + item.id); // Make report
        let data;
        while (!(data = yield fetch('/report/' + reportInfo.id))) { // Fetch report
            yield sleep(1000); // Wait for report
        }
        item.date = data.date;
        const imageInfo = yield fetch('/generate-image/' + item.id); // Make image
        let image;
        while (!( image = yield fetch('/generated-image/' + imageInfo.id))) { // Fetch image
            yield sleep(1000); // Wait for report
        }
        item.image = image;
        yield model.save(item); // Store updated element
    }
    console.log('Saved item', item); // Done
});

