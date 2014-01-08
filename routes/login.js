var express = require('express');
var client = require('../client.js');

var config = require('../config.js');

var app = express();

app.post('/', function (req, res){
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
		res.redirect('/');
	});
});

module.exports = app;
