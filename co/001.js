const model = require('./model');
const fetch = require('./fetch');
const co = require('co');

const ID = 1;

co(function *() {
    const item = yield model.get(ID); // Get Item by ID
    const data = yield fetch('/item/' + item.id); // Fetch Updates
    item.date = data.date;
    yield model.save(item); // Store updated element
    console.log('Saved item', item); // Done
});
