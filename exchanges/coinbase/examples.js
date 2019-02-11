var logger = require('logger').createLogger('/home/qu/logs/qu_coinbase.log'); // logs to a file

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

// const Gdax = require('gdax');
// const publicClient = new Gdax.PublicClient();

// // GET 100 TRADES LAST_ID = 59064031
// publicClient.getProductTrades('BTC-USD', (err, resp, data) => {
//     if (err) {
//         console.log("err", err);
//     }
//     console.log(data[99].trade_id);
// });

// // TRADES WEBSOCKET
// let from = 59064031
// let to = from + 5
// let last = from;
// let current;

// publicClient
//     .getProductTradeStream('BTC-USD', from, to)
//     .on('data', data => {
//         current = data.trade_id;
//         console.log(data);
//         last = current;
//     })
//     .on('end', () => {
//         console.log("end");
//     })
//     .on('error', err => {
//         console.log("err", err);
//     });


// // BOOK WEBSOCKET
// const orderbookSync = new Gdax.OrderbookSync(['BTC-USD', 'ETH-USD']);
// console.log(orderbookSync.books['ETH-USD'].state());