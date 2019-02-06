var logger = require('logger').createLogger('binance.log'); // logs to a file

var express = require("express");
var app = express();
var path = require("path");


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.listen(process.env.NODE_PORT || 3000);

console.log("Running at Port " + process.env.NODE_PORT || 3000);

setInterval(function () {
    logger.info('ping', 'now!');
}, 3000);
