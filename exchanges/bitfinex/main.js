var logger = require('logger').createLogger('/home/qu/logs/qu_bitfinex.log'); // logs to a file

var express = require("express");
var app = express();
var path = require("path");

if(process.env.NODE_PORT)
	var port = process.env.NODE_PORT
else
	var port = 3000

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port);

console.log("Running at Port " + port);

setInterval(function () {
    logger.info('ping', 'PORT_NUMBER',port);
}, 3000);

