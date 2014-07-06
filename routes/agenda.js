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
      obj.date = new Date(obj.date);
      
      res.render('agenda/edit', {
        'conference': obj,
        'data': {}
      });
    }
  });

});

app.post('/new', function (req,res, next) {
  client.post({
    'path': '/agenda-events',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'conference':  req.body.conference,
    'title':       req.body.title,
    'description': req.body.description,
    'date':        new Date(req.body.year, req.body.month, req.body.day, req.body.hour, req.body.minutes, 0, 0).toISOString()

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Event <strong>' + obj.title + '</strong> created successfully');
      res.redirect('/conferences/' + req.body.conference + '/agenda');
    }
  });

});

app.get('/:id/edit', function (req, res, next) {
  client.get({
    'path': '/agenda-events/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');

    } else {
      res.render('agenda/edit', {
        'data': obj,
        'edit': true
      });
    }
  });
});


app.post('/:id/edit', function (req, res, next) {
  client.patch({
    'path': '/agenda-events/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'title':       req.body.title,
    'description': req.body.description,
    'date':        new Date(req.body.year, req.body.month, req.body.day, req.body.hour, req.body.minutes, 0, 0).toISOString()

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Event <strong>' + obj.title + '</strong> modified successfully');
      res.redirect('/conferences/' + obj.conference.id + '/agenda');
    }
  });
});

app.post('/delete/:id', function (req, res, next) {
  client.del({
    'path': '/agenda-events/' + req.params.id ,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', 'The event has been successfully removed!')
    }

    res.redirect('/conferences/' + req.body.conference + '/agenda');
  });
});

module.exports = app;