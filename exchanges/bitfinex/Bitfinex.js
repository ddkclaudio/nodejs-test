const QuBase = require("../QuBase")
const BFX = require('bitfinex-api-node')


module.exports = class Bitfinex extends QuBase {
    constructor(symbols, timeToSaveInSeconds = 1) {
        super(timeToSaveInSeconds)
        this.symbols = symbols
        this.connectBook()
    }

    connectBook(self = this) {
        // CRIANDO OBJETO BFX
        this.bfx = new BFX({
            ws: {
                autoReconnect: true,
                seqAudit: true,
                packetWDDelay: 10 * 1000
            }
        })

        // CRIANDO COMUNICACAO WEBSOCKET v2
        this.ws = this.bfx.ws(2, {
            manageOrderBooks: true,
            transform: true
        })

        // CALLBACK DE ERRO
        this.ws.on('error', (err) => {
            console.log('error: %j', err)
        })

        // CALLBACK DE SUCESSO
        this.ws.on('open', () => {
            self.symbols.forEach(function (symbol) {
                console.log('open', symbol)

                // SUBSCRIBES
                self.ws.subscribeOrderBook('t' + symbol, 'R0', 100)
                self.ws.subscribeTrades(symbol)

                // CALLBACK T&T PARA ATUALIZACOES
                self.ws.onTrades({ symbol: 't' + symbol }, (trades) => {
                    self.newTrades({ symbol: symbol, trades: trades })
                })

                self.ws.onOrderBook({ symbol: 't' + symbol }, (ob) => {
                    console.log(symbol, ob);
                })


            })
        })

        this.ws.open()
    }

    normalize() {
        console.log("Bitfinex.normalize()");
    }


}