var express = require('express') , path = require('path');

var config = require('./config.js');

var app = express();

app.use(express.logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.urlencoded());

app.get('/', function(req, res) {
   res.render('index');
});

app.use('/login', require('./routes/login.js'));
app.use('/signup', require('./routes/signup.js'));

app.listen(config.http.port);
