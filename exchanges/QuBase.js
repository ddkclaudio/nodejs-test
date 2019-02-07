const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class QuBase {
    constructor(symbols, dbname, user, password, host, dialect, timeToSaveInSeconds = 1) {
        const self = this
        this.symbols = symbols
        this.timeToSaveInSeconds = timeToSaveInSeconds
        this.timeoutToSave = null
        this.openDataBase(dialect, host, dbname, user, password)

        this.coins = {}
        this.symbols.forEach(function (symbol) {
            self.coins[symbol] = {}
            self.coins[symbol].trades = []
            self.coins[symbol].book = {}
            self.coins[symbol].book.bids = []
            self.coins[symbol].book.asks = []
        })
    }

    openDataBase(dialect, host, dbname, user, password) {
        if (this.sequelize)
            this.sequelize.close()

        this.sequelize = new Sequelize(dbname, user, password, {
            host: host,
            dialect: dialect,
            logging: false,

            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },

            // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
            operatorsAliases: false
        });
    }

    setTimeoutToSave(timeToSaveInSeconds, self = this) {
        if (this.timeoutToSave != null)
            clearInterval(this.timeoutToSave);

        this.timeoutToSave = setInterval(() => {
            self._save()
        }, timeToSaveInSeconds * 1000);
    }

    _onTrades(trade = { symbol: null, trades: null }) {
        if (this.timeoutToSave == null)
            this.setTimeoutToSave(this.timeToSaveInSeconds)
        this.handleTrades(trade)
    }

    handleTrades(trade) {
        console.log("Alert::QuBase", "handleTrades");
    }

    _onOrderBook(orderBook) {
        this.handleOrderBook(orderBook)
    }

    handleOrderBook(orderBook) {
        console.log("Alert::QuBase", "handleOrderBook");
    }

    _save() {
        const self = this

        // COPIA PROFUNDA
        var toSave = JSON.stringify(this.coins)
        toSave = JSON.parse(toSave)

        // SALVANDO CADA INSTRUMENTO
        this.symbols.forEach(function (symbol) {

            // ESCOLHENDO UM INSTRUMENTO
            const coin = toSave[symbol]
            console.log("QuBase", "save()", symbol);

            // CRIANDO A TABELA DO INSTRUMENTO
            const tablename = moment(new Date()).format('YYYYMMDD') + '_' + symbol
            const Marketdata = self.sequelize.define(tablename, {
                market_data: Sequelize.TEXT,
                start: Sequelize.DATE,
            });

            // SALVANDO O INSTRUMENTO
            self.sequelize.sync()
                .then(() => Marketdata.create({
                    market_data: JSON.stringify(coin),
                    start: new Date()
                }))
                .then(result => {
                    console.log(result.toJSON());
                });
        })
    }
}

