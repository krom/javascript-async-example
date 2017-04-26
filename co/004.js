const model = require('./model');
const fetch = require('./fetch');
const co = require('co');

co(function *() {
    const items = yield model.all(); // Get all items
    for (let item of items) { // process all items
        const reportInfo = yield fetch('/item-report/' + item.id); // Make report
        const data = yield fetch('/report/' + reportInfo.id); // Fetch report
        item.date = data.date;
        const imageInfo = yield fetch('/generate-image/' + item.id); // Make image
        const image = yield fetch('/generated-image/' + imageInfo.id); // Fetch image
        item.image = image;
        yield model.save(item); // Store updated element
    }
    console.log('Saved item', item); // Done
});

