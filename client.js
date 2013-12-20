var restify = require('restify');

var client = restify.createJsonClient({
	'url' : 'http://raspi.darkhogg.es:4321',
	'version' : '*'
});

module.exports = client;
