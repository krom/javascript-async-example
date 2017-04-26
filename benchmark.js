const co = require('co');
const async = require('async');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

/**
 * Callback benchmark test
 * @param deferred
 */
const cb_test = function (deferred) {
    try {
        function cb5(val, cb) {
            cb(val);
        }

        function cb4(val, cb) {
            cb5(val, cb);
        }

        function cb3(val, cb) {
            cb4(val, cb);
        }

        function cb2(val, cb) {
            cb3(val, cb);
        }

        function cb1(val, cb) {
            cb2(val, cb);
        }

        cb1(true, function (res) {
            deferred.resolve(res);
        });
    } catch (err) {
        console.log(err.message);
    }
};

/**
 * Callback benchmark test
 * @param deferred
 */
const cb_test_optimized = function (deferred) {
    function cb5(val, cb) {
        cb(val);
    }

    function cb4(val, cb) {
        cb5(val, cb);
    }

    function cb3(val, cb) {
        cb4(val, cb);
    }

    function cb2(val, cb) {
        cb3(val, cb);
    }

    function cb1(val, cb) {
        cb2(val, cb);
    }

    cb1(true, function (res) {
        deferred.resolve(res);
    });
};


/**
 * Promise benchmark test
 * @param deferred
 */
const promise_test = function (deferred) {
    try {
        function f1(val) {
            return new Promise(function (resolve) {
                resolve(val);
            })
        }

        function f2(val) {
            return new Promise(function (resolve) {
                resolve(val);
            })
        }

        function f3(val) {
            return new Promise(function (resolve) {
                resolve(val);
            })
        }

        function f4(val) {
            return new Promise(function (resolve) {
                resolve(val);
            })
        }

        function f5(val) {
            return new Promise(function (resolve) {
                resolve(val);
            })
        }

        f1(true)
            .then(function (res) {
                return f2(res);
            })
            .then(function (res) {
                return f3(res);
            })
            .then(function (res) {
                return f4(res);
            })
            .then(function (res) {
                return f5(res);
            })
            .then(function (result) {
                deferred.resolve(result);
            })
    } catch (err) {
        console.log(err.message);
    }
};

/**
 * CO benchmark test
 * @param deferred
 */
const co_test = function (deferred) {

    try {
        function * f5(val) {
            return val
        }

        function * f4(val) {
            return yield * f5(val);
        }

        function * f3(val) {
            return yield * f4(val);
        }

        function * f2(val) {
            return yield * f3(val);
        }

        function * f1(val) {
            return yield * f2(val);
        }

        co(function *() {
            const res = yield f1(true);
            deferred.resolve(res);
        });
    } catch (err) {
        console.log(err.message);
    }
};

/**
 * Async benchmark test
 * @param deferred
 */
const async_test = function (deferred) {
    try {
        async function f5(val) {
            return val;
        }

        async function f4(val) {
            return await f5(val);
        }

        async function f3(val) {
            return await f4(val);
        }

        async function f2(val) {
            return await f3(val);
        }

        async function f1(val) {
            return await f2(val);
        }

        f1(true).then(function (res) {
            deferred.resolve(res);
        })
    } catch (err) {
        console.log(err.message);
    }
};

const lib_async_test = function (deferred) {
        function f1(callback) {
            // console.log(1);
            callback(null, true);
        }

        function f2(arg1, callback) {
            // console.log(2);
            callback(null, arg1);
        }

        function f3(arg1, callback) {
            // console.log(3);
            callback(null, arg1);
        }

        function f4(arg1, callback) {
            // console.log(4);
            callback(null, arg1);
        }

        function f5(arg1, callback) {
            // console.log(5);
            callback(null, arg1);
        }
    // try {
        async.waterfall([
            f1,
            f2,
            f3,
            f4,
            f5,
        ], function (err, result) {
            deferred.resolve();
        });
    // } catch (err) {
    //     console.log(err.message);
    // }
};

suite
    .add('Callback', {
        defer: true,
        fn: cb_test,
    })
    .add('Promise', {
        defer: true,
        fn: promise_test,
    })
    .add('CO', {
        defer: true,
        fn: co_test,
    })
    .add('native Async', {
        defer: true,
        fn: async_test,
    })
    .add('lib Async', {
        defer: true,
        fn: lib_async_test,
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name').join(' and '));
        console.log('Slowest is ' + this.filter('slowest').map('name').join(' and '));
    })
    .run();