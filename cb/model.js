/**
 * @file model.js
 *
 */
module.exports = {
    get: function (id, cb) {
        cb({
            id: id,
            name: 'item',
            url: '/item/' + id + '.json'
        });
    },
    all: function (cb) {
        cb([{
            id: 1,
            name: 'item 1',
            url: '/item/1.json'
        }, {
            id: 2,
            name: 'item 2',
            url: '/item/2.json'
        }, {
            id: 3,
            name: 'item 3',
            url: '/item/3.json'
        }, {
            id: 4,
            name: 'item 4',
            url: '/item/4.json'
        }]);
    },
    save: function (item, cb) {
        cb(item);
    }
};