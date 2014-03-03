var express = require('express');
var client = require('../client.js');
var winston = require('winston');

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


app.get('/', function (req, res, next) {
  client.get({
    'path': '/users/' + req.session.loginData.userId + '/conferences',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      winston.error(err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      res.render('conferences/index', {
        'conferences': obj
      });
    }
  });
}); 


app.get('/new', function (req, res, next) {
  // GET - Just render the form
  res.render('conferences/edit', {
    'data': {}
  });
});

app.post('/new', function (req, res, next) {
  // POST - Check data, then create it
  var name = req.body.name;
  var description = req.body.description;

  if (!name) {
    req.flash('error', 'You must specify a conference name');
    return res.render('conferences-new', {
      'data': {
        'name': name,
        'description': description
      }
    });
  }

  // Everything ok -- POST!
  client.post({
    'path': '/conferences',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'name': name,
    'description': description
  }, function (err, areq, ares, obj) {
    // Display the error if any
    if (err) {
      req.flash('error', 'An error ocurred while saving the conference: ' + obj.code);
      return res.render('conferences-new', {
        'data': {
          'name': name,
          'description': description
        }
      });
    }

    // Redirect to conferences and say ok
    req.flash('success', 'Conference created successfully!');
    return res.redirect('/conferences');
  });
});


app.get('/:id', function (req, res, next) {
  client.get({
    'path': '/conferences/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');

    } else {
      res.render('conferences/view', {
        'conference': obj
      });
    }
  });
});

app.post('/:id/delete', function (req, res, next) {
  client.del({
    'path': '/conferences/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', 'The conference has been successfully removed!')
    }

    res.redirect('/');
  });
});


app.get('/:id/documents', function (req, res, next) {
  client.get({
    'path': '/conferences/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      winston.error(err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      res.render('documents/index', {
        'conference': obj
      });
    }
  });
});


app.get('/:id/announcements', function (req, res, next) {
  client.get({
    'path': '/conferences/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      res.render('announcements/index', {
        'conference': obj
      });
    }
  });
});

app.get('/:id/venues', function (req, res, next) {
  client.get({
    'path': '/conferences/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      res.render('venues/index', {
        'conference': obj
      });
    }
  });
});


module.exports = app;