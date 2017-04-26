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
]);