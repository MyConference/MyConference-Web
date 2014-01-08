var conf = {};

conf.debug = process.env.NODE_ENV != 'production';

conf.http = {
	port: process.env.PORT || 3000
};

conf.application = process.env.APPLICATION || '997adc41-9e79-4c32-9928-c58129443546';

module.exports = conf;