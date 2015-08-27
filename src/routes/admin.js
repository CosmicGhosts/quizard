var helpers = require('./helpers')
var models = helpers.models
var User = models.User
var Admin = models.Admin

var renderUsersView = helpers.render('users')
function renderUsers (res) {
  return function (users) {
    renderUsersView(res, { users: users })
  }
}

var renderEldersView = helpers.render('elders')
function renderElders (res) {
  return function (elders) {
    renderEldersView(res, { elders: elders })
  }
}

function authLogin (passport) {
  return passport.authenticate('local-login', {
    failureRedirect: '/login',
    successRedirect: '/admin'
  })
}

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}

function getUsers (req, res) {
  return User
    .findAll({ include: [{ model: models.UserAnswer }] })
    .then(renderUsers(res))
}

function getAdmins (req, res) {
  return Admin
    .findAll()
    .then(renderElders(res))
}

function renderAdminDashboard (req, res) {
  res.render('admin/dashboard')
}

function renderLogin (req, res) {
  res.render('admin/login')
}

module.exports = function (app, passport) {
  app.get('/admin', isLoggedIn, renderAdminDashboard)
  app.get('/admin/login', renderLogin)
  app.get('/admin/users', isLoggedIn, getUsers)
  app.get('/admin/elders', getAdmins)
  app.post('/admin/login', authLogin(passport))
}
