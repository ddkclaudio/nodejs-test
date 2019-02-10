const QuBinance = require("./QuBinance")
const quBinance = new QuBinance(0,['BTCUSDT'],"qua_binance")

// const Binance = require('node-binance-api');
// const binance = new Binance();
// global.ticker = {};
// var markets = ["BTCUSDT","ETHBTC"]

// binance.prices((error, ticker) => {
//     if (error)
//         return
//     // PEGANDO TODOS OS SYMBOLOS
//     const symbols = Object.keys(ticker)
//     // markets = symbols
//     joinTT()
// });

// function joinTT() {
//     // Subscribe to trades endpoint for all markets
//     binance.websockets.trades(markets, (trades) => {
//         let {
//             "e": EventType,
//             "p": Price,
//             "q": Quantity,
//             "T": Tradetime,
//             "m": IsTheBuyerTheMarketMaker,
//             "t": TradeID,
//             "b": BuyerorderID,
//             "a": SellerorderID,
//             "E": EventTime,
//             "s": Symbol,
//             "M": Ignore
//         } = trades;

//         if (EventType != "trade")
//             return

//         const normalized = {
//             // BASIC INFOS
//             order_id: TradeID,
//             timestamp: Tradetime,
//             amount: (IsTheBuyerTheMarketMaker) ? Quantity : -Quantity,
//             price: Price,
//             // EXTRAS
//             buyer_order_id: BuyerorderID,
//             seller_order_id: SellerorderID,
//             event_time: EventTime,
//             symbol: Symbol,
//             ignore: Ignore,
//             is_the_buyer_the_market_maker: IsTheBuyerTheMarketMaker
//         }

//         // console.log(Symbol)
//     });

//     // You can use global.ticker anywhere in your program now
//     setInterval(() => {
//         // console.log("*** Price of BTC: " + global.ticker.BTCUSDT);
//     }, 3000);
// }

// // PEGAR POR REST A CADA 1MIN
// binance.depth("BTCUSDT", (error, depth, symbol) => {
//     console.log(symbol, "market depth", depth);
// });

// PEGAR E MANTER POR WEBSOCKET
// binance.websockets.depthCache(['BTCUSDT'], (symbol, depth) => {
//     let bids = binance.sortBids(depth.bids);
//     let asks = binance.sortAsks(depth.asks);
//     console.log(symbol+" depth cache update");
//     console.log("bids", bids);
//     console.log("asks", asks);
//     console.log("best bid: "+binance.first(bids));
//     console.log("best ask: "+binance.first(asks));
//   });