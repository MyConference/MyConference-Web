var express = require('express') , path = require('path');

var app = express();

app.use(express.logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
   res.sendfile('./views/index.html');
});

app.use('/login', require('./routes/login.js'));
app.use('/signup', require('./routes/signup.js'));

app.listen(3000);
