const Gdax = require('gdax');
const QuBase = require('../QuBase')

module.exports = class QuCoinbase extends QuBase {
    constructor(id, symbols, dbname = "teste", user = "root", password = "root", host = "localhost", dialect = "mysql", timeToSaveBookInSeconds = 10) {
        super(symbols, dbname, user, password, host, dialect, timeToSaveBookInSeconds)
        this.connectWithExchange(symbols)
    }

    showAllSymbols() {

    }

    connectWithExchange(markets) {
        // CRIANDO OBJETO BFX
        this.publicClient = new Gdax.PublicClient();
        this.orderbookSync = new Gdax.OrderbookSync(markets);

    }

    handleTrades(trades) {
        // this.coins[Symbol].trades.push(normalized)
    }

    updateBookToSave() {
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            const side = this.orderbookSync.books[symbol].state()
            this.handleOrderBook({ symbol: symbol, bids: side.bids.slice(0, 100), asks: side.asks.slice(0, 100) })
        }
    }

    handleOrderBook(orderBook) {
        const symbol = orderBook.symbol
        this.coins[symbol].book.bids = []
        this.coins[symbol].book.asks = []
        var amount = 0
        
        for (let i = 0; i < orderBook.bids.length; i++) {
            const element = orderBook.bids[i];
            amount = element.size.toNumber()

            const normalized = {
                order_id: element.id,
                price: element.price.toNumber(),
                amount: amount,
            }
            this.coins[symbol].book.bids.push(normalized)
        }

        for (let i = 0; i < orderBook.asks.length; i++) {
            const element = orderBook.asks[i];
            amount = element.size.toNumber()

            const normalized = {
                order_id: element.id,
                price: element.price.toNumber(),
                amount: amount,
            }
            this.coins[symbol].book.asks.push(normalized)
        }
    }
}