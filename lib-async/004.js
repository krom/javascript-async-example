const model = require('./model');
const fetch = require('./fetch');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const each = require('async/each');

/**
 * Process one item
 * @param {Object} item Item
 * @param {Function} callback
 */
function processItem(item, callback) {
    waterfall([
        function (next) {
            fetch('/item-report/' + item.id, next); // Make report
        },
        function (report, next) {
            fetch('/report/' + report.id, next); // Fetch report
        },
        function (data, next) {
            item.date = data.date;
            fetch('/generate-image/' + item.id, next); // Make image
        },
        function (data, next) {
            fetch('generated-image/' + data.id, next); // Fetch image
        },
        function (data, next) {
            item.image = data;
            next(null, item);
        },
        function (item, next) {
            model.save(item, next); // Store updated element
        },
        function (item) {
            console.log('Saved item', item); // Done
        }
    ], callback);
}

model.all(function (err, items) { // Get all items
    each(items, processItem, function () { // Start processing items
        console.log('Done');
    })
});