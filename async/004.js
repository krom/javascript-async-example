const model = require('./model');
const fetch = require('./fetch');

async function main() {
    const items = await model.all(); // Get all items
    for (let item of items) { // process all items
        const reportInfo = await fetch('/item-report/' + item.id); // Make report
        const data = await fetch('/report/' + reportInfo.id); // Fetch report
        item.date = data.date;
        const imageInfo = await fetch('/generate-image/' + item.id); // Make image
        const image = await fetch('/generated-image/' + imageInfo.id); // Fetch image
        item.image = image;
        await model.save(item); // Store updated element
        console.log('Saved item', item); // Done
    }
    console.log('Add done'); // All done
}

main();
