module.exports = class QuBase {
    constructor(timeToSaveInSeconds = 1) {
        this.timeToSaveInSeconds = timeToSaveInSeconds * 1000
    }

    onTrades(trade = { symbol: null, trades: null }) {
        console.log("QuBase.onTrades()", "t" + trade.symbol, `trades: ${JSON.stringify(trade.trades)}`)
    }

    onOrderBook(orderBook = { symbol: null, orderBook: null }) {
        console.log("QuBase.onOrderBook()", "t" + orderBook.symbol, `trades: ${JSON.stringify(orderBook.orderBook)}`)
    }

    save() {
        console.log("QuBase", "save()");
    }
}