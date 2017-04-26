const model = require('./model');
const fetch = require('./fetch');

const ID = 1;
model.get(ID, function (item) { // Get Item by ID
    fetch('/item-report/' + item.id, function (report) { // Make report
        fetch('/report/' + report.id, function (data) { // Fetch report
            item.date = data.date;
            fetch('/generate-image/'+item.id, function (image_report) { // Make image
                fetch('/generated-image/'+image_report.id, function (image) { // Fetch image
                    item.image = image;
                    model.save(item, function (el) { // Store updated element
                        console.log('Saved item', el); // Done
                    })
                });
            });

        });

    })
});

