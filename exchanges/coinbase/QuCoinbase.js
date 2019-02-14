const Gdax = require('gdax');
const QuBase = require('../QuBase')

module.exports = class QuCoinbase extends QuBase {
    constructor(id, symbols, dbname = "teste", user = "root", password = "root", host = "localhost", dialect = "mysql", timeToSaveBookInSeconds = 60) {
        super(symbols, dbname, user, password, host, dialect, timeToSaveBookInSeconds)
        this.connectWithExchange(symbols)
    }

    showAllSymbols() {

    }

    connectWithExchange(markets) {
        // CRIANDO OBJETO BFX
        this.publicClient = new Gdax.PublicClient();
        this.orderbookSync = new Gdax.OrderbookSync(markets);

        // for (let i = 0; i < markets.length; i++) {
        //     const market = markets[i];
        //     console.log(market, "=============================");

        //     this.getProductTrades(market)

        // }

    }

    getProductTrades(market) {
        // GET 100 TRADES LAST_ID = 59064031
        this.publicClient.getProductTrades(market, (err, resp, data) => {
            if (err) {
                console.log("\n\nerr" + market, err);
            }

            this._onTrades({ symbol: market, trades: data })
        });
    }

    handleTrades(trades) {
        // NORMALIZANDO MENSAGENS
        trades.trades.reverse()

        for (let j = 0; j < trades.trades.length; j++) {
            const trade = trades.trades[j];
            console.log(trade.trade_id, '<=', this.coins[trades.symbol].lastTrade, trade.trade_id <= this.coins[trades.symbol].lastTrade);

            if (trade.trade_id <= this.coins[trades.symbol].lastTrade)
                continue

            const normalized = {
                order_id: trade.trade_id,
                time_trade: trade.time,
                amount: (trade.side == 'buy') ? trade.size : -trade.size,
                price: trade.price,
            }

            this.coins[trades.symbol].trades.push(normalized)
            this.coins[trades.symbol].lastTrade = trade.trade_id
        }

        this.saveTrade(trades.symbol)
    }

    saveAllTrade() {
        console.log("Salvando trades websocket", this.id, new Date());
        for (let i = 0; i < this.symbols.length; i++) {
            this.getProductTrades(this.symbols[i])
        }
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