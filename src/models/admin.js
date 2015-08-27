var bcrypt = require('bcrypt-nodejs')

module.exports = function (sequelize, DataTypes) {
  var Admin = sequelize.define('Admin', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Admin.hasOne(models.User)
      },
      generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
      },
      validPassword: function (adminHash, password) {
        return bcrypt.compareSync(password, adminHash)
      }
    }
  })

  return Admin
}
