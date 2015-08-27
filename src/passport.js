var Admin          = require('./models').Admin
var LocalStrategy  = require('passport-local').Strategy

function validPassword (passHash, password) {
  return Admin.validPassword(passHash, password)
}

function isValidAdmin (admin, password) {
  if (!admin) { return false }
  if (!validPassword(admin.password, password)) { return false }
  return true
}

function getAdminByEmail (email) {
  return Admin.findOne({ where: { email: email } })
}

function passOrFail (isValid, admin, done) {
  if (!isValid) {
    done(null, false, 'Try Again.')
  } else {
    done(null, admin)
  }
}

function handleLogin (req, email, password, done) {
  getAdminByEmail(email)
    .then(function (admin) {
      var isValid = isValidAdmin(admin, password)
      passOrFail(isValid, admin, done)
    })
    .catch(done)
}

module.exports = function (passport) {
  passport.serializeUser(function (admin, done) {
    done(null, admin.id)
  })

  passport.deserializeUser(function (id, done) {
    Admin.findById(id)
      .then(function (admin) {
        done(null, admin)
      })
      .catch(done)
  })

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, handleLogin))
}
