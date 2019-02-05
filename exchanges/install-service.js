// https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/
var fs = require('fs');
const { exec } = require('child_process');

// ============= DEFININDO CONSTANTES 
const FILE_TEMPLATE = 'template.service.example'
const PATH_SYSTEMD = '/lib/systemd/system'

// ============= LISTA DE EXCHANGES A SEREM INSTALADAS
const service = []
service.push({
    PORT_NUMBER: 3002,
    name: "binance"
})
service.push({
    PORT_NUMBER: 3003,
    name: "bitfinex"
})
service.push({
    PORT_NUMBER: 3004,
    name: "coinbase"
})

// ============= CRIANDO ARQUIVO DAEMON
service.forEach(function(exchange) {
    fs.readFile(FILE_TEMPLATE, 'utf8', function(err, txt) {
        const path = `${process.cwd()}/${exchange.name}/main.js`
        txt = txt.replace("PORT_NUMBER", exchange.PORT_NUMBER).replace("FILE_TO_EXECUTE", path)

        const SERVICE_FILE_PATH = `${PATH_SYSTEMD}/qu_${exchange.name}.service`
        fs.writeFile(SERVICE_FILE_PATH, txt, function(err) {
            if (err) throw err;
            console.log(SERVICE_FILE_PATH, ' Installed!');
        });
    });
});


// ============= INSTALANDO ARQUIVOS DAEMON 

exec('systemctl daemon-reload', (err, stdout, stderr) => {

    service.forEach(function(exchange) {
        exec('systemctl start qu_' + exchange.name, (err, stdout, stderr) => {
            exec('systemctl enable qu_' + exchange.name, (err, stdout, stderr) => { });
        });
    });

});

