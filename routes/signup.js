var express = require('express');
var client = require('../client.js');

var config = require('../config.js');

var app = express();

app.post('/', function (req, res){
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
		res.redirect('/');
	});
});

module.exports = app;
