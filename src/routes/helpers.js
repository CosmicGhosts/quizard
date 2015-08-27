function render (view) {
  return function (res, data) {
    res.render(view, data)
  }
}

exports.render = render
exports.models = require('../models')
