const model = require('./model');
const fetch = require('./fetch');

const ID = 1;
model.get(ID, function (item) { // Get Item by ID
    fetch('/item-report/' + item.id, function (report) { // Make report
        fetch('/report/' + report.id, function (data) { // Fetch report
            item.date = data.date;
            model.save(item, function (el) { // Store updated element
                console.log('Saved item', el); // Done
            })
        });

    })
});