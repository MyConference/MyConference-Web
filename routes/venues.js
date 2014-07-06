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
      res.render('venues/edit', {
        'conference': obj,
        'data': {}
      });
    }
  });

});

app.post('/new', function (req,res, next) {
  client.post({
    'path': '/venues',
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'conference': req.body.conference,
    'name':       req.body.name,
    'location': {
      'lat':      req.body.latitude,
      'lng':      req.body.longitude 
    },
    'details':    req.body.details,

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Venue <strong>' + obj.name + '</strong> created successfully');
      res.redirect('/conferences/' + req.body.conference + '/venues');
    }
  });

});

app.get('/:id/edit', function (req, res, next) {
  client.get({
    'path': '/venues/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/');

    } else {
      obj.latitude = obj.location.lat;
      obj.longitude = obj.location.lng;
      
      res.render('venues/edit', {
        'data': obj,
        'edit': true
      });
    }
  });
});


app.post('/:id/edit', function (req, res, next) {
  client.patch({
    'path': '/venues/' + req.params.id,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, {
    'name':       req.body.name,
    'location': {
      'lat':      req.body.latitude,
      'lng':      req.body.longitude 
    },
    'details':    req.body.details,

  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
      res.redirect('/'); // FIXME infinite redirect loop

    } else {
      req.flash('success', 'Venue <strong>' + obj.name + '</strong> modified successfully');
      res.redirect('/conferences/' + obj.conference.id + '/venues');
    }
  });
});



app.post('/delete/:id', function (req, res, next) {
  client.del({
    'path': '/venues/' + req.params.id ,
    'headers': {
      'authorization': 'Token ' + req.session.loginData.accessToken
    }
  }, function (err, areq, ares, obj) {
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', 'The venue has been successfully removed!')
    }

    res.redirect('/conferences/' + req.body.conference + '/venues');
  });
});

module.exports = app;