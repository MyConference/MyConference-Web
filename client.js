var restify = require('restify');

var client = restify.createJsonClient({
	'url' : 'http://myconf-api-dev.herokuapp.com',
	'version' : '*'
});

module.exports = client;
