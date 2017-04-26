const model = require('./model');
const fetch = require('./fetch');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const parallel = require('async/parallel');

/**
 * Get report
 * @param reportId
 * @param cb
 */
function getReport(reportId, cb) {
    fetch('/report/' + reportId, function (report) {
        if (report) {
            cb(null, report);
        } else {
            setTimeout(function () {
                getReport(reportId, cb);
            }, 1000);
        }
    })
}

/**
 * Get generated image
 * @param imageId
 * @param cb
 */
function getImage(imageId, cb) {
    fetch('/generated-image/' + imageId, function (report) {
        if (report) {
            cb(null, report);
        } else {
            setTimeout(function () {
                getImage(imageId, cb);
            }, 1000);
        }
    })
}

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
            getReport(report.id, next); // Fetch report
        },
        function (data, next) {
            item.date = data.date;
            fetch('/generate-image/' + item.id, next); // Make image
        },
        function (data, next) {
            getImage(data.id, next); // Fetch image
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
    const threads = items.map(function (item) {
        return function (callback) {
            processItem(item, callback);
        }
    });

    parallel(threads, function () { // Start processing items
        console.log('Done');
    })
});