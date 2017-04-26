const model = require('./model');
const fetch = require('./fetch');
const sleep = require('promise-sleep');

async function main() {
    const items = await model.all(); // Get all items
    await Promise.all(items.map(async function (item) { // Process all items
        const reportInfo = await fetch('/item-report/' + item.id); // Make report
        let data;
        while (!(data = await fetch('/report/' + reportInfo.id))) { // Fetch report
            await sleep(1000); // Wait for report
        }
        item.date = data.date;
        const imageInfo = await fetch('/generate-image/' + item.id); // Make image
        let image;
        while (!( image = await fetch('/generated-image/' + imageInfo.id))) { // Fetch image
            await sleep(1000); // Wait for report
        }
        item.image = image;
        await model.save(item); // Store updated element
        console.log('Saved item', item); // Done
    }));
    console.log('All done');
}

main();
