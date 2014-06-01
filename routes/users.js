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


app.get('/invite', function (req,res, next) {
  if (!req.query.conference) {
    return res.redirect('/conferences');
  }

  client.get({
    'path': '/conferences/' + req.query.conference,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      res.render('users/invite', {
        'conference': obj,
        'data': {}
      });
    }
  });

});



app.post('/invite', function (req, res, next) {
client.post({
    'path': '/invite-codes',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'conference': req.body.conference,
    'recipient_name': req.body.name,
    'recipient_email': req.body.email,

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');

    } else {
      req.flash('success', 'An invite code has been sent to <strong>' + req.body.email + '</strong>');
      res.redirect('/conferences/' + req.body.conference + '/users');
    }
  });
});


module.exports = app;