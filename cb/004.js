const model = require('./model');
const fetch = require('./fetch');

/**
 * Process all items
 * @param items
 * @param index
 * @param cb
 */
function processItem(items, index, cb) {
    const item = items[index];
    fetch('/item-report/' + item.id, function (report) { // Make report
        fetch('/report/' + report.id, function (data) { // Fetch report
            item.date = data.date;
            fetch('/generate-image/' + item.id, function (image_report) { // Make image
                fetch('/generated-image/' + image_report.id, function (image) { // Fetch image
                    item.image = image;
                    model.save(item, function (el) { // Store updated element
                        console.log('Saved item', el); // Done
                        if (index < items.length -1){
                            processItem(items, index+1, cb);
                        } else {
                            cb();
                        }
                    })
                });
            });

        });

    })
}

model.all(function (items) { // Get all items
    var index = 0;
    processItem(items, index, function () { // Start processing items
        console.log('Done');
    })
});