var express = require('express')
var path = require('path')
var sass = require('node-sass')
var flash = require('connect-flash');
var uuid = require('node-uuid');
var MongoStore = require('connect-mongo')(express);

var config = require('./config.js');

var app = express();

if (config.debug) {
	app.use(express.logger('dev'));
}

app.use(express.cookieParser('keyboard cat'));
app.use(express.session({
    cookie: { maxAge: 7 * 86400 * 1000 },
    salt: '2af705ba6fd940b3abd6b4e7cdcc0f355a1ea15707c642b78bd2-529f72f3d071',
    store: new MongoStore({
        url: config.mongo.url
    })
}));
app.use(flash());

app.use(
     sass.middleware({
         src: __dirname + '/sass', //Where the sass files are 
         dest: __dirname + '/public/css', //Where css should go
         debug: false,
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
    res.locals.session = req.session;

    if (!req.session.device) {
        req.session.device = uuid.v4();
    }

	next();
});

app.use('/',            require('./routes/index.js'));
app.use('/conferences', require('./routes/conferences.js'));

app.listen(config.http.port, function (err) {
    if (err) {
        console.log('Error while starting server: ', err);
    } else {
        console.log('Listening on port %s', config.http.port);
    }
});
