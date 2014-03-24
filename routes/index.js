var express = require('express');
var client = require('../client.js');

var config = require('../config.js');

var app = express();


/* =============== */
/* === LANDING === */

app.get('/', function(req, res) {
	if (req.session.loginData) {
		return res.redirect('/conferences');
	}

  res.render('index/landing');
});


/* ============= */
/* === LOGIN === */

app.get('/login', function(req, res) {
  res.render('index/login');
	req.session.lastBody = {};
});

app.post('/login', function (req, res) {
	req.session.lastBody = req.body;

	if (!req.body.email) {
		req.flash('error', 'Enter your Email below');
		res.redirect('/login');

	} else if (!req.body.password) {
		req.flash('error', 'Enter your Password below');
		res.redirect('/login');

	} else {
		client.post('/auth', {
			'application_id' : config.application,
			'device_id' : req.session.device,
			'credentials' : {
				'type' : 'password',
				'email' : req.body.email,
				'password' : req.body.password
			}
		}, function (err, areq, ares, obj) {
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
				req.session.loginData = {
					'accessToken': obj.access_token,
					'accessTokenExpires': new Date(obj.access_token_expires).getTime(),
					'refreshToken': obj.refresh_token,
					'refreshTokenExpires': new Date(obj.refresh_token_expires).getTime(),
					'userId': obj.user.id
				};
				res.redirect('/conferences');
			}
		});
	}
});

/* ============== */
/* === SIGNUP === */
app.get('/signup', function(req, res) {
   res.render('index/signup');
});

app.post('/signup', function (req, res) {
	if (!req.body.email){
		req.flash('error', 'Email can\'t be empty');
		res.redirect('/signup');

	} else if(req.body.password.length < 8){
		req.flash('error', 'Password needs at least 8 characters');
		res.redirect('/signup');

	} else if(req.body.password != req.body.repeat_password){
		req.flash('error', 'Passwords don\'t match');
		res.redirect('/signup');

	} else {
		client.post('/auth/signup', {
			'application_id' : config.application,
			'device_id' : req.session.device,
			'user_data' : {
				'email' : req.body.email,
				'password' : req.body.password
			}
		}, function (err, areq, ares, obj){
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
	}
});

/* ==================== */
/* =======LOGOUT======= */
app.get('/logout', function(req, res) {
   res.render('index/logout');
});

app.post('/logout', function (req, res){
	console.log('LOGOUT');
	if (req.session.loginData){
		client.post({
			path: '/auth/logout', 
			headers: {authorization: 'Token ' + req.session.loginData.accessToken}
		}, {}, function (err, areq, ares, obj) {
			console.log('ERROR: %s', err);
			console.dir(obj);
			req.session.loginData = null;
			res.redirect('/');
		});
	} else {
		res.redirect('/');
	}
});

/* ==================== */
/* =====DASHBOARD====== */
app.get('/dashboard', function(req, res) {
   res.render('index/dashboard');
});

module.exports = app;
