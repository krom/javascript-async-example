const model = require('./model');
const fetch = require('./fetch');

/**
 * Get report
 * @param reportId
 * @param cb
 */
function getReport(reportId, cb) {
    fetch('/report/' + reportId, function (report) {
        if (report) {
            cb(report);
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
            cb(report);
        } else {
            setTimeout(function () {
                getImage(imageId, cb);
            }, 1000);
        }
    })
}

/**
 * Callback magic
 * @param items
 * @param index
 * @param cb
 */
function processChain(items, index, cb) {
    if (index < items.length - 1) {
        processItem(items[index], function () {
            processChain(items, index + 1, cb);
        });
    } else {
        cb();
    }
}

/**
 * Process one item
 * @param item process item
 * @param cb
 */
function processItem(item, cb) {
    fetch('/item-report/' + item.id, function (report) { // Make report
        getReport(report.id, function (data) { // Fetch report
            item.date = data.date;
            fetch('/generate-image/' + item.id, function (image_report) { // Make image
                getImage(image_report.id, function (image) { // Fetch image
                    item.image = image;
                    model.save(item, function (el) { // Store updated element
                        console.log('Saved item', el); // Done
                        cb();
                    })
                });
            });
        });

    })
}

model.all(function (items) { // Get all items
    var index = 0;
    processChain(items, index, function () { // Start processing items
        console.log('Done');
    })
});