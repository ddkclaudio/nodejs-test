// https://github.com/bitfinexcom/bitfinex-api-node/blob/master/examples/ws2/order_books.js
const BFX = require('bitfinex-api-node')

const bfx = new BFX({
    ws: {
        autoReconnect: true,
        seqAudit: true,
        packetWDDelay: 10 * 1000
    }
})

let ws = bfx.ws(2, {
    manageOrderBooks: true, // tell the ws client to maintain full sorted OBs
    transform: true // auto-transform array OBs to OrderBook objects
})

ws.on('error', (err) => {
    console.log('error: %j', err)
})

ws.on('open', () => {
    console.log('open')
    ws.subscribeOrderBook('tBTCUSD', 'R0', 100)
    ws.subscribeTrades('BTCUSD')
})

// 'ob' is a full OrderBook instance, with sorted arrays 'bids' & 'asks'
ws.onOrderBook({ symbol: 'tBTCUSD' }, (ob) => {
    // console.log(ob);
})

// https://www.npmjs.com/package/bitfinex-api-node
ws.onTrades({ symbol: 'tBTCUSD' }, (trades) => {
    console.log(`trades: ${JSON.stringify(trades)}`)
})

ws.open()