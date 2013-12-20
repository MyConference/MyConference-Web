var express = require('express');
var client = require('../client.js');

var app = express();

app.post('/', function(req, res){
	console.log('LOGIN');
	client.post('/auth', {
		'application_id' : '997adc41-9e79-4c32-9928-c58129443546',
		'client_id' : 'id',
		'credentials' : {
			'type' : 'password',
			'email' : 'p.morgado@ucm.es',
			'password' : 'myconference'
		}
	}, function(err, areq, ares, obj){
		console.log('ERROR: %s', err);
		console.dir(obj);
		res.redirect('/');
	});
});

module.exports = app;
