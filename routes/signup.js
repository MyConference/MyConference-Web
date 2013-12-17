var express = require('express');

var app = express();

app.post('/', function(req, res){
	console.log('SIGNUP');
	res.end();
});

module.exports = app;
