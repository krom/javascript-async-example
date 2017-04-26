const model = require('./model');
const fetch = require('./fetch');

const ID = 1;

async function main() {
    const item = await model.get(ID); // Get Item by ID
    const reportInfo = await fetch('/item-report/' + item.id); // Make report
    const data = await fetch('/report/' + reportInfo.id); // Fetch report
    item.date = data.date;
    const imageInfo = await fetch('/generate-image/' + item.id); // Make image
    const image = await fetch('/generated-image/' + imageInfo.id); // Fetch image
    item.image = image;
    await model.save(item); // Store updated element
    console.log('Saved item', item); // Done
}


main();
