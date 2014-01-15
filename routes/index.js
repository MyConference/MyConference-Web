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
		if (err) {
			if (obj.code == "invalid_email_or_password"){
				req.flash('error', 'Wrong email or password');
			} else {
				req.flash('error', 'Unknown login error (' + obj.code + ')')
			}
			res.redirect('/login');
		} else {
			res.redirect('/dashboard');
		}
	});
});


/* ==================== */
/* =======SIGNUP======= */
app.get('/signup', function(req, res) {
   res.render('signup');
});

app.post('/signup', function (req, res){
	console.log('SIGNUP');
	if(req.body.password == req.body.repeat_password){
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
			if (err) {
				if (obj.code == "invalid_email"){
					req.flash('error', 'Invalid email');
				} else if (obj.code == "invalid_password"){
					req.flash('error', 'Invalid password')
				} else {
					req.flash('error', 'Unknown signup error (' + obj.code + ')')
				}
				res.redirect('/signup');
			} else {
				req.flash('success', 'Success signup');
				res.redirect('/login');
			}
		});
	} else {
		req.flash('error', 'Passwords don\'t match');
		res.redirect('/signup');
	}
});

/* ==================== */
/* =====DASHBOARD====== */
app.get('/dashboard', function(req, res) {
   res.render('dashboard');
});

module.exports = app;
