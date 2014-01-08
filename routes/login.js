var express = require('express');
var client = require('../client.js');

var app = express();

app.post('/', function(req, res){
	console.log('LOGIN');
	client.post('/auth', {
		'application_id' : 'b5eb92ea-9b39-4e76-8f85-5742d36d4bab',
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
