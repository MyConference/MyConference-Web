var express = require('express');
var client = require('../client.js');

var config = require('../config.js');

var app = express();


// Redirect to login if not logged in
app.use(function (req, res, next) {
  if (!req.session.loginData) {
    return res.redirect('/login');
  } else {
    return next();
  }
});
