var extend = require('util')._extend

function Cacher (initialCache) {
  var cache = extend({}, initialCache)
  var api = {
    get: function (key) {
      return cache[key]
    },
    set: function (key, value) {
      cache[key] = value
      return api
    }
  }
  return api
}

module.exports = Cacher
