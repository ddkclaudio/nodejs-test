module.exports = class QuBase {
    constructor(timeToSaveInSeconds = 1) {
        this.timeToSaveInSeconds = timeToSaveInSeconds
        this.timeoutToSave = null
    }

    setTimeoutToSave(timeToSaveInSeconds, self = this) {
        if (this.timeoutToSave != null)
            clearInterval(this.timeoutToSave);

        this.timeoutToSave = setInterval(() => {
            self._save()
        }, timeToSaveInSeconds * 1000);
    }

    onTrades(trade = { symbol: null, trades: null }) {
        if (this.timeoutToSave == null)
            this.setTimeoutToSave(this.timeToSaveInSeconds)

        console.log("QuBase.onTrades()", "t" + trade.symbol, `trades: ${JSON.stringify(trade.trades)}`)
    }

    onOrderBook(orderBook = { symbol: null, orderBook: null }) {
        // console.log("QuBase.onOrderBook()", "t" + orderBook.symbol, `trades: ${JSON.stringify(orderBook.orderBook)}`)
    }

    _save() {
        console.log("QuBase", "save()", "=============================");
    }
}