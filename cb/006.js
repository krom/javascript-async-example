const model = require('./model');
const fetch = require('./fetch');
let counter = 0;
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

function processItem(item, cb) {
    fetch('/item-report/' + item.id, function (report) { // Make report
        getReport(report.id, function (data) { // Fetch report
            item.date = data.date;
            fetch('/generate-image/' + item.id, function (image_report) { // Make image
                getImage(image_report.id, function (image) { // Fetch image
                    item.image = image;
                    model.save(item, function (el) { // Store updated element
                        console.log('Saved item', el); // Done
                        if (--counter == 0) {
                            cb(); //
                        }
                    })
                });
            });

        });

    })
}

model.all(function (items) { // Get all items
    counter = items.length;
    for (let index in items) {
        processItem(items[index], function () { // Start processing items
            console.log('Done');
        })
    }
});