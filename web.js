var express = require('express')
var path = require('path')
var sass = require('node-sass')
var flash = require('connect-flash');
var uuid = require('node-uuid');
var MongoStore = require('connect-mongo')(express);
var winston = require('winston');
var sprintf  = require('sprintf');

var config = require('./config.js');
var client = require('./client.js');

var app = express();

/* ===================== */
/* === SETUP WINSTON === */

winston.clear();
winston.cli();
winston.add(winston.transports.Console, {
  'timestamp': !config.debug ? false : function () {
    var date = new Date();
    return sprintf('\033[90m%02d:%02d:%02d.%03d\033[m',
      date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  },
  'prettyPrint': true,
  'colorize': config.debug,
  'level': config.debug ? 'debug' : 'info'
});



winston.info('MyConference Web starting in ' +
  (config.debug ? 'debug' : 'production').toUpperCase() + ' mode');

/* Setup logger */
if (config.debug) {
	app.use(express.logger('dev'));
}

app.use(express.cookieParser('d00eed0632844a4ead6939d9dd49bde5ae0e1f3a609d5'));
app.use(express.session({
    cookie: { maxAge: 7 * 86400 * 1000 },
    salt: '2af705ba6fd940b3abd6b4e7cdcc0f355a1ea15707c642b78bd2529f72f3d071',
    store: new MongoStore({
        url: config.mongo.url
    })
}));
app.use(flash());

/* Configure the SASS middleware */
app.use(
    sass.middleware({
        src: __dirname + '/sass', //Where the sass files are 
        dest: __dirname + '/public/css', //Where css should go
        debug: false,
        outputStyle: config.debug ? 'expanded' : 'compressed',
        prefix: '/css/'
    })
);

/* Serve as static files from /public */
app.use(express.static(path.join(__dirname, 'public')));

/* Setup Jade as view engine */
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

/* Parse URL Encoded bodies */
app.use(express.urlencoded());

/* Initialization for every request */
app.use(function (req, res, next) {
	res.locals.flash = req.flash.bind(req);
    res.locals.session = req.session;

    if (!req.session.device) {
        req.session.device = uuid.v4();
    }

    if (!req.session.lastBody) {
        req.session.lastBody = {};
    }

	next();
});

/* Check if refresh token is expired */
app.use(function (req, res, next) {
  if (!req.session.loginData){
    return next();
  }

  if(Date.now() < req.session.loginData.refreshTokenExpires){
    if(Date.now() >= req.session.loginData.accessTokenExpires){
      console.dir(req.session); 
      client.post('/auth', {
        'application_id' : config.application,
        'device_id' : req.session.device,
        'credentials' : {
          'type' : 'refresh',
          'refresh_token' : req.session.loginData.refreshToken
        }
      }, function (err, areq, ares, obj) {
        console.log('ERROR: %s', err);
        console.dir(obj);
        
        if (err) {
          req.session.loginData = null;
          return next(err);
        }

        req.session.loginData = {
          'accessToken': obj.access_token,
          'accessTokenExpires': new Date(obj.accessTokenExpires).getTime(),
          'refreshToken': obj.refresh_token,
          'refreshTokenExpires': new Date(obj.refreshTokenExpires).getTime(),
          'userId': obj.user.id
        };

        return next();
      });
    } else {
      return next();
    }
  } else {
    req.session.loginData = null;
    return next();
  }
});

/* Bind routes */
app.use('/',              require('./routes/index.js'));
app.use('/conferences',   require('./routes/conferences.js'));
app.use('/documents',     require('./routes/documents.js'));
app.use('/announcements', require('./routes/announcements.js'));
app.use('/venues',        require('./routes/venues.js'));

/* Run the server */
app.listen(config.http.port, function (err) {
    if (err) {
        winston.error('Error while starting server: ', err);
    } else {
        winston.info('Server listening on %s', config.http.port);
    }
});
