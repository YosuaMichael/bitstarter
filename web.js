var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
var str = "";
fs.readFile('index.html',function(err,data) {
  if (err) throw err;
  str = data.toString();
  //console.log(data);
  //console.log(str);
});

app.get('/', function(request, response) {
  response.send(str);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
