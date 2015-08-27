var Cacher = require('./cacher')

var QuestionCacher = function (initialCache) {
  var cache = Cacher(initialCache)
  return {
    get: cache.get,
    set: function (token, id) {
      var answered = (cache.get(token) || [])
      answered.push(id)
      cache.set(token, answered)
    }
  }
}

module.exports = QuestionCacher
