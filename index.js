var express = require('express');
var app = express();
 
app.listen(3000);

app.get('/', function(request, response) {
   response.sendfile('./views/index.html');
});
