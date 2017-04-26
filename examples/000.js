/**
 * Subfunction
 * @param cb
 */
function foo(cb) {
    // Do something
    process.nextTick(cb);
}

/**
 * Top function
 * @param cb
 */
function top(cb) {
    // Sleep form next slot
    process.nextTick(function () {
        foo(cb);
    });
}

/**
 * My Async function
 * @param n
 * @param cb
 */
function longFunction(n, cb) {
    let a = 1,
        b = 1;
    for (let i = 3; i <= n; i++) {
        let c = a + b;
        a = b;
        b = c;
    }
    return cb(b);
}

longFunction(10000, function (result) {
    console.log('10000: ' + result);
});

