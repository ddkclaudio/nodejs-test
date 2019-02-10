const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class QuBase {
    constructor(symbols, dbname, user, password, host, dialect, timeToSaveBookInSeconds) {
        this.id = -1
        const self = this
        this.symbols = symbols
        this.timeoutToSave = null
        this.openDataBase(dialect, host, dbname, user, password)
        this.setTimeoutToSaveBook(timeToSaveBookInSeconds)
        this.setTimeoutToSaveTrade(this.getAPrimeNumber())

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

    setTimeoutToSaveBook(timeToSaveBookInSeconds, self = this) {
        if (this.timeoutToSave != null)
            clearInterval(this.timeoutToSave);

        this.timeoutToSave = setInterval(() => {
            self._saveBook()
        }, timeToSaveBookInSeconds * 1000);
    }

    setTimeoutToSaveTrade(timeToTradeInSeconds, self = this) {
        console.log("Primo escolhido", timeToTradeInSeconds);

        if (this.timeoutToSaveTrade != null)
            clearInterval(this.timeoutToSaveTrade);

        this.timeoutToSaveTrade = setInterval(() => {
            self.saveAllTrade()
        }, timeToTradeInSeconds * 1000);
    }

    _onTrades(trade = { symbol: null, trades: null }) {
        this.handleTrades(trade)
    }

    handleTrades(trades) {
        console.log("Alert::QuBase", "handleTrades");
    }

    _onOrderBook(orderBook) {
        this.handleOrderBook(orderBook)
    }

    handleOrderBook(orderBook) {
        console.log("Alert::QuBase", "handleOrderBook");
    }

    _saveBook() {
        const self = this

        // COPIA PROFUNDA
        var toSave = JSON.stringify(this.coins)
        toSave = JSON.parse(toSave)

        // SALVANDO CADA INSTRUMENTO
        this.symbols.forEach(function (symbol) {

            // ESCOLHENDO UM INSTRUMENTO
            const coin = toSave[symbol]

            // CRIANDO A TABELA DO INSTRUMENTO
            const tablename = moment(new Date()).format('YYYYMMDD') + "_" + symbol + '_mbo'
            const Marketdata = self.sequelize.define(tablename, {
                market_data: Sequelize.TEXT,
                start: Sequelize.DATE,
            });

            // SALVANDO O INSTRUMENTO
            self.sequelize.sync()
                .then(() => Marketdata.create({
                    market_data: JSON.stringify(coin.book),
                    start: new Date()
                }))
                .then(result => {
                    console.log("book salvo");

                });
        })
    }

    saveTrade(symbol) {
        // console.log(symbol, "salvando ...");
        const trades = this.coins[symbol].trades

        if (trades.length == 0)
            return

        this.coins[symbol].trades = []

        const self = this
        // CRIANDO A TABELA DO INSTRUMENTO
        const tablename = moment(new Date()).format('YYYYMMDD') + "_" + symbol + '_trade'
        const Marketdata = self.sequelize.define(tablename, {
            order_id: Sequelize.DOUBLE,
            time_trade: Sequelize.DATE,
            amount: Sequelize.DOUBLE,
            price: Sequelize.DOUBLE,
        });

        // SALVANDO O INSTRUMENTO
        self.sequelize.sync()
            .then(() => Marketdata.bulkCreate(trades))
            .then(result => {
                // console.log(symbol, "salvo com sucesso!!");
            });
    }

    saveAllTrade() {
        console.log("Salvando trades websocket", this.id, new Date());
        for (let i = 0; i < this.symbols.length; i++)
            this.saveTrade(this.symbols[i])
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    getAPrimeNumber() {
        const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53]
        return primes[this.getRandomIntInclusive(0, primes.length - 1)]
    }
}

