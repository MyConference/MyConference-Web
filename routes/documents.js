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


app.get('/new', function (req,res, next) {
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
      res.render('documents/edit', {
        'conference': obj,
        'data': {}
      });
    }
  });

});

app.post('/new', function (req,res, next) {
  client.post({
    'path': '/documents',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'conference':  req.body.conference,
    'title':       req.body.title,
    'description': req.body.description,
    'type':        req.body.type,
    'data':        req.body.data

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Document <strong>' + obj.title + '</strong> created successfully');
      res.redirect('/conferences/' + req.body.conference + '/documents');
    }
  });

});


module.exports = app;