var conf = {};

conf.debug = process.env.NODE_ENV != 'production';

conf.http = {
	port: process.env.PORT || 3000
};

conf.mongo = {
	'url': process.env.MONGOLAB_URI 
		|| process.env.MONGO_URL
		|| 'mongodb://localhost/myconference-web'
};

conf.transloadit = {
  'auth_key':   process.env.TRANSLOADIT_AUTH_KEY,
  'secret_key': process.env.TRANSLOADIT_SECRET_KEY,
  'url':        process.env.TRANSLOADIT_URL
}

conf.apiUrl = process.env.API_URL || 'http://localhost:4321';

conf.application = process.env.APPLICATION;

module.exports = conf;
