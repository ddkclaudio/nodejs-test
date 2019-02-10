const Binance = require('node-binance-api');
const binance = new Binance();
global.ticker = {};
var markets = []

binance.prices((error, ticker) => {
    if (error)
        return
    // PEGANDO TODOS OS SYMBOLOS
    const symbols = Object.keys(ticker)
    markets = symbols
    // markets.push("BTCUSDT")
    // markets.push("ETHBTC")
    joinTT()
});

function joinTT() {
    // Subscribe to trades endpoint for all markets
    binance.websockets.trades(markets, (trades) => {
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
            // BASIC INFOS
            order_id: TradeID,
            timestamp: Tradetime,
            amount: (IsTheBuyerTheMarketMaker) ? Quantity : -Quantity,
            price: Price,
            // EXTRAS
            buyer_order_id: BuyerorderID,
            seller_order_id: SellerorderID,
            event_time: EventTime,
            symbol: Symbol,
            ignore: Ignore,
            is_the_buyer_the_market_maker: IsTheBuyerTheMarketMaker
        }

        console.log(Symbol)
    });

    // You can use global.ticker anywhere in your program now
    setInterval(() => {
        // console.log("*** Price of BTC: " + global.ticker.BTCUSDT);
    }, 3000);
}

