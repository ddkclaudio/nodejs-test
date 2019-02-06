module.exports = class QuBase {
    constructor(timeToSaveInSeconds = 1) {
        this.timeToSaveInSeconds = timeToSaveInSeconds * 1000
    }

    save() {
        console.log("QuBase", "save()");
    }

    newTrades(trade = { symbol: null, trades: null }) {
        console.log("QuBase.newTrades()", "t" + trade.symbol, `trades: ${JSON.stringify(trade.trades)}`)
        this.normalize()
    }

    normalize() {
        console.log("QuBase.normalize()");
    }

}