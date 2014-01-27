var express = require('express');
var client = require('../client.js');

var config = require('../config.js');

var app = express();


app.get('/', function (req, res, next) {
  if (!req.session.loginData) {
    return res.redirect('/login');
  }

  client.get({
    'path': '/users/' + req.session.loginData.userId + '/conferences',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/dashboard');

    } else {
      res.render('conferences', {
        'conferences': obj
      });
    }
  });
});

module.exports = app;