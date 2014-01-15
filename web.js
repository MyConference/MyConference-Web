var express = require('express') , path = require('path'), sass = require('node-sass'), flash = require('connect-flash');

var config = require('./config.js');

var app = express();

if (config.debug) {
	app.use(express.logger('dev'));
}

app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(
     sass.middleware({
         src: __dirname + '/sass', //Where the sass files are 
         dest: __dirname + '/public/css', //Where css should go
         debug: config.debug,
         outputStyle: config.debug ? 'expanded' : 'compressed',
         prefix: '/css/'
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.urlencoded());

app.use(function (req, res, next) {
	res.locals.flash = req.flash.bind(req);
	next();
});

app.use('/', require('./routes/index.js'));

app.listen(config.http.port);
