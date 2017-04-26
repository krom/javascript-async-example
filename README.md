Javascript Async Example
========================

Async implementations with

* Native async
* Callbacks
* [co](https://www.npmjs.com/package/co) library
* [async](https://www.npmjs.com/package/async) library
* Promises


Task for implementation
-----------------------

* Load item from DB
* Get update for item
* Get image for item
* Save updated item into DB
* Generate report and image and retrieve them instead one request for each 

Implementations
---------------

* 001 - One item
* 002 - One item with report
* 003 - One Item with report and image
* 004 - All Items
* 005 - Wait for report
* 006 - Parallel processing
* 007 - Final result with error handling and other


Limitations
-----------
* fetch stub function is not implemented fully, need to implement stub result depending on request

Benchmark
---------

Run `node benchmark.js` for real test or see [benchmark.txt](benchmark.txt) for exists benchmark result (Tested on *2,2 GHz Intel Core i7*)