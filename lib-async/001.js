const model = require('./model');
const fetch = require('./fetch');
const waterfall = require('async/waterfall');
const apply = require('async/apply');

const ID = 1;
let item;
waterfall([
    apply(model.get, ID), // Get Item by ID
    function (data, next) {
        item = data;
        fetch('/item/' + item.id, next); // Fetch Updates
    },
    function (data, next) {
        item.date = data.date;
        next(null, item);
    },
    function (item, next) {
        model.save(item, next); // Store updated element
    },
    function (item) {
        console.log('Saved item', item); // Done
    }
]);

