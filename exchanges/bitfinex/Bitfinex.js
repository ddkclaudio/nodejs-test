const QuBase = require("../QuBase")
const BFX = require('bitfinex-api-node')

module.exports = class Bitfinex extends QuBase {
    constructor(id, symbols, dbname = "teste", user = "root", password = "root", host = "localhost", dialect = "mysql", timeToSaveBookInSeconds = 60) {
        super(symbols, dbname, user, password, host, dialect, timeToSaveBookInSeconds)
        this.connectWithExchange()
        this.id = id
        console.log("Websocket id", this.id);

    }
    static someMethod() {
        console.log('Doing someMethod');
    }

    connectWithExchange() {
        const self = this
        // CRIANDO OBJETO BFX
        this.bfx = new BFX({
            ws: {
                autoReconnect: true,
                seqAudit: true,
                packetWDDelay: 10 * 1000
            }
        })

        // CRIANDO COMUNICACAO WEBSOCKET v2
        this.ws = this.bfx.ws(2, {
            manageOrderBooks: true,
            transform: true
        })

        // CALLBACK DE ERRO
        this.ws.on('error', (err) => {
            console.log('error: %j', err)
        })

        // CALLBACK DE SUCESSO
        this.ws.on('open', () => {
            self.symbols.forEach(function (symbol) {

                // SUBSCRIBES
                self.ws.subscribeOrderBook('t' + symbol, 'R0', 100)
                self.ws.subscribeTrades(symbol)

                // CALLBACK T&T PARA ATUALIZACOES
                self.ws.onTrades({ symbol: 't' + symbol }, (trades) => {
                    self._onTrades({ symbol: symbol, trades: trades })
                })

                self.ws.onOrderBook({ symbol: 't' + symbol }, (orderBook) => {
                    self._onOrderBook({ symbol: symbol, orderBook: orderBook })
                })
            })
        })

        this.ws.open()
    }

    handleTrades(msg) {
        const self = this
        msg.trades.forEach(function (trade) {
            const normalized = {
                order_id: trade.id,
                time_trade: trade.mts,
                amount: trade.amount,
                price: trade.price,
            }
            self.coins[msg.symbol].trades.push(normalized)
        })
    }

    handleOrderBook(orderBook) {
        this.coins[orderBook.symbol].book.bids = orderBook.orderBook.bids
        this.coins[orderBook.symbol].book.asks = orderBook.orderBook.asks
    }
}