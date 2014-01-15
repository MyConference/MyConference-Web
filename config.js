var conf = {};

conf.debug = process.env.NODE_ENV != 'production';

conf.http = {
	port: process.env.PORT || 3000
};

conf.apiUrl = process.env.API_URL || 'http://localhost:4321';

conf.application = process.env.APPLICATION;

module.exports = conf;
