async function foo() {
    let item = await getItem();
    await sleep(1000);
    try {
        await saveItem(item);
    } catch (err) {
        console.log("Can't save item");
    }
}


function bar() {
    getItem(function (err, item) {
        window.setTimeout(function () {
            saveItem(item, function (err, saved) {
                if (err) {
                    console.log("Can't save item");
                }
            })
        }, 1000);
    })
}


const sleep = require('promise-sleep');

async function foo() {
    let item = await getItem();
    await sleep(1000);
    await saveItem(item);
}

/**
 * Correct
 */
async function foo2() {
    let item = await getItems();
    const result = await ps_promised({pid: item.pid});

    await saveItem(item);
}


/**
 * Wrong
 */
async function foo() {
    const items = await getItems();
    items.forEach(function (item) {
        const data = await
        fetch(item.url);
    })
}

/**
 * Correct
 */
async function bar() {
    const items = await getItems();
    for (let item of items) {
        const data = await fetch(item.url);
    }
}


/**
 * Simple function
 * @return {Promise.<*>}
 */
async function promised() {
    return Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Hello');
        }, 1000);
    });
}

/**
 * Main code
 * @return {Promise.<*>}
 */
async function main() {
    try {
        let message = await promised();
        return `${message} world`;
    } catch (error) {
        console.error(error.message);
        return 'Unknown result';
    }
}

/**
 * Run
 */
main().then(function (result) {
    console.log(result);
});


