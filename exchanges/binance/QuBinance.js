const QuBase = require("../QuBase")
const Binance = require('node-binance-api');

module.exports = class QuBinance extends QuBase {
    constructor(id, symbols, dbname = "teste", user = "root", password = "root", host = "localhost", dialect = "mysql", timeToSaveBookInSeconds = 60) {
        super(symbols, dbname, user, password, host, dialect, timeToSaveBookInSeconds)
        this.connectWithExchange(symbols)
    }

    showAllSymbols() {
        this.binance.prices((error, ticker) => {
            if (error)
                return
            // PEGANDO TODOS OS SYMBOLOS
            const symbols = Object.keys(ticker)
            console.log(JSON.stringify(symbols));
            // markets = symbols
        });
    }

    connectWithExchange(markets) {
        // CRIANDO OBJETO BFX
        this.binance = new Binance();
        const self = this

        // Subscribe to trades endpoint for all markets
        this.binance.websockets.trades(markets, (trades) => {
            self.handleTrades(trades)
        });

        this.binance.websockets.depthCache(markets, (symbol, depth) => {
            self.handleOrderBook({ symbol: symbol, depth: depth })
        });
    }

    handleTrades(trades) {
        let {
            "e": EventType,
            "p": Price,
            "q": Quantity,
            "T": Tradetime,
            "m": IsTheBuyerTheMarketMaker,
            "t": TradeID,
            "b": BuyerorderID,
            "a": SellerorderID,
            "E": EventTime,
            "s": Symbol,
            "M": Ignore
        } = trades;

        if (EventType != "trade")
            return

        const normalized = {
            order_id: TradeID,
            time_trade: Tradetime,
            amount: (IsTheBuyerTheMarketMaker) ? Quantity : -Quantity,
            price: Price,
            buyer_order_id: BuyerorderID,
            seller_order_id: SellerorderID,
            event_time: EventTime,
            symbol: Symbol,
            ignore: Ignore,
            is_the_buyer_the_market_maker: IsTheBuyerTheMarketMaker
        }
        this.coins[Symbol].trades.push(normalized)
    }

    handleOrderBook(orderBook) {
        let bids = this.binance.sortBids(orderBook.depth.bids);
        let asks = this.binance.sortAsks(orderBook.depth.asks);
        this.coins[orderBook.symbol].book.bids = bids
        this.coins[orderBook.symbol].book.asks = asks
    }
}