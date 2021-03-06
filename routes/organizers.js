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
      res.render('organizers/edit', {
        'conference': obj,
        'data': {}
      });
    }
  });

});

app.post('/new', function (req,res, next) {
  client.post({
    'path': '/organizers',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'conference': req.body.conference,
    'name': req.body.name,
    'origin': req.body.origin,
    'details': req.body.details,
    'group': req.body.group

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Organizer <strong>' + obj.name + '</strong> added successfully');
      res.redirect('/conferences/' + req.body.conference + '/organizers');
    }
  });

});

app.get('/:id/edit', function (req, res, next) {
  client.get({
    'path': '/organizers/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');

    } else {
      res.render('organizers/edit', {
        'data': obj,
        'edit': true
      });
    }
  });
});


app.post('/:id/edit', function (req, res, next) {
  client.patch({
    'path': '/organizers/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'name': req.body.name,
    'origin': req.body.origin,
    'details': req.body.details,
    'group': req.body.group

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Organizer <strong>' + obj.name + '</strong> modified successfully');
      res.redirect('/conferences/' + obj.conference.id + '/organizers');
    }
  });
});


app.post('/delete/:id', function (req, res, next) {
  client.del({
    'path': '/organizers/' + req.params.id ,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', 'The organizer has been successfully removed!')
    }

    res.redirect('/conferences/' + req.body.conference + '/organizers');
  });
});

module.exports = app;