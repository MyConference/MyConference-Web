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
      res.render('speakers/edit', {
        'conference': obj,
        'data': {}
      });
    }
  });

});

app.post('/new', function (req,res, next) {
  client.post({
    'path': '/speakers',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'conference': req.body.conference,
    'name': req.body.name,
    'origin': req.body.origin,
    'charge': req.body.charge,
    'description': req.body.description,
    'picture_url': JSON.parse(req.body.transloadit).results.resize_xxhdpi[0].ssl_url

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Speaker <strong>' + obj.name + '</strong> added successfully');
      res.redirect('/conferences/' + req.body.conference + '/speakers');
    }
  });

});

app.get('/:id/edit', function (req, res, next) {
  client.get({
    'path': '/speakers/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');

    } else {
      res.render('speakers/edit', {
        'data': obj,
        'edit': true
      });
    }
  });
});

app.post('/delete/:id', function (req, res, next) {
  client.del({
    'path': '/speakers/' + req.params.id ,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', 'The speaker has been successfully removed!')
    }

    res.redirect('/conferences/' + req.body.conference + '/speakers');
  });
});

module.exports = app;