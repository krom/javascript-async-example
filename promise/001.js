const model = require('./model');
const fetch = require('./fetch');

const ID = 1;
var item;
model.get(ID).then(function (data) { // Get Item by ID
    item = data;
    return fetch('/item/' + item.id); // Fetch Updates
}).then(function (data) {
    item.date = data.date;
    return model.save(item); // Store updated element
}).then(function () {
    console.log('Saved item', item); // Done
});