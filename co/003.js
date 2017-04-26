const model = require('./model');
const fetch = require('./fetch');
const co = require('co');

const ID = 1;

co(function *() {
    const item = yield model.get(ID); // Get Item by ID
    const reportInfo = yield fetch('/item-report/' + item.id); // Make report
    const data = yield fetch('/report/' + reportInfo.id); // Fetch report
    item.date = data.date;
    const imageInfo = yield fetch('/generate-image/' + item.id); // Make image
    const image = yield fetch('/generated-image/' + imageInfo.id); // Fetch image
    item.image = image;
    yield model.save(item); // Store updated element
    console.log('Saved item', item); // Done
});

