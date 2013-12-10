var express = require('express') , path = require('path');
var app = express();
 
app.listen(3000);

app.configure(function(){
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(request, response) {
   response.sendfile('./views/index.html');
});
