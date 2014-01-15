var restify = require('restify'), config = require('./config.js');

var client = restify.createJsonClient({
	'url' : config.apiUrl,
	'version' : '*'
});

module.exports = client;
