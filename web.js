var express = require('express') , path = require('path'), sass = require('node-sass');

var config = require('./config.js');

var app = express();

app.use(express.logger('dev'));

app.use(
     sass.middleware({
         src: __dirname + '/sass', //Where the sass files are 
         dest: __dirname + '/public/css', //Where css should go
         debug: true,
         outputStyle: 'compressed',
         prefix: '/css/'
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.urlencoded());

app.use('/', require('./routes/index.js'));

app.listen(config.http.port);
