const model = require('./model');
const fetch = require('./fetch');

const ID = 1;
var item;
model.get(ID)
     .then(function (data) { // Get Item by ID
         item = data;
         return fetch('/item-report/' + item.id); // Make report
     })
     .then(function (report) {
         return fetch('/report/' + report.id); // Fetch report
     })
     .then(function (data) {
         item.date = data.date;
         return fetch('/generate-image/'+item.id); // Make image
     })
     .then(function (image_report) {
         return fetch('/generated-image/'+image_report.id); // Fetch image
     })
     .then(function (image) {
         item.image = image;
         return model.save(item); // Store updated element
     })
     .then(function () {
         console.log('Saved item', item); // Done
     });
