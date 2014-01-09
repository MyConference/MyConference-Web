var express = require('express');
var client = require('../client.js');

var config = require('../config.js');

var app = express();


/* ==================== */
/* =======LANDING======== */
app.get('/', function(req, res) {
   res.render('landing');
});

/* ==================== */
/* =======LOGIN======== */
app.get('/login', function(req, res) {
   res.render('login');
});

app.post('/login', function (req, res){
	console.log('LOGIN');
	client.post('/auth', {
		'application_id' : config.application,
		'client_id' : 'id',
		'credentials' : {
			'type' : 'password',
			'email' : req.body.email,
			'password' : req.body.password
		}
	}, function (err, areq, ares, obj){
		console.log('ERROR: %s', err);
		console.dir(obj);
		res.redirect('/dashboard');
	});
});


/* ==================== */
/* =======SIGNUP======= */
app.get('/signup', function(req, res) {
   res.render('signup');
});

app.post('/signup', function (req, res){
	console.log('SIGNUP');
	client.post('/auth/signup', {
		'application_id' : config.application,
		'client_id' : 'id',
		'user_data' : {
			'email' : req.body.email,
			'password' : req.body.password
		}
	}, function (err, areq, ares, obj){
		console.log('ERROR: %s', err);
		console.dir(obj);
		res.redirect('/dashboard');
	});
});

/* ==================== */
/* =====DASHBOARD====== */
app.get('/dashboard', function(req, res) {
   res.render('dashboard');
});

module.exports = app;
