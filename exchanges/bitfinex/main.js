// // https://github.com/bitfinexcom/bitfinex-api-node/blob/master/examples/ws2/order_books.js
const BFX = require('bitfinex-api-node')
const Bitfinex = require('./Bitfinex')
var bitfinexs = []

const bfx = new BFX({
    ws: {
        autoReconnect: true,
        seqAudit: true,
        packetWDDelay: 10 * 1000
    }
})

const rest = bfx.rest(2)
rest.symbols().then(symbols => {
    symbols = symbols.map(function (x) { return x.toUpperCase() })
    symbols = symbols.slice(0, 40)

    var newarray = splitArray(symbols, getChuncks(symbols.length, 5))

    for (let i = 0; i < newarray.length; i++) {
        bitfinexs.push(new Bitfinex(i, newarray[i], 'qua_bitfinex'))
    }

}).catch(err => {
    console.log('error: %j', err)
})

function splitArray(array, chunk = 250) {
    var temparray = []
    var i, j;

    for (i = 0, j = array.length; i < j; i += chunk) {
        temparray.push(array.slice(i, i + chunk));
    }

    return temparray
}

function roundToUP(n) {
    var decimal = n - Math.floor(n)

    if (decimal != 0)
        n = (n - decimal) + 1

    return (n == 0) ? 1 : n
}

function getChuncks(size, limit) {
    var chunks = roundToUP(size / limit)
    return roundToUP(size / chunks)
}
