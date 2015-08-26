var fs        = require("fs")
var path      = require("path")
var Sequelize = require("sequelize")
var env       = process.env.NODE_ENV || "development"
var basePath  = '../'
var config    = require(basePath + 'config/config.json')[env]
var sequelize = new Sequelize(config.database, config.username, config.password, config)

function isModelFile (file) {
  var notHiddenFile = (file.indexOf(".") !== 0)
  var notThisFile = (file !== "index.js")
  return notHiddenFile && notThisFile
}

function getModel (file) {
  var filePath = path.join(__dirname, file)
  var model = sequelize.import(filePath)
  return model
}

function buildDB (db, model) {
  db[model.name] = model
  return db
}

var models = fs
  .readdirSync(__dirname)
  .filter(isModelFile)
  .map(getModel)

var db = models.reduce(buildDB, {})
models.forEach(function (model) {
  ('associate' in model) && model.associate(db)
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
