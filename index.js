const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = new Sequelize('test', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
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

const models = []
console.log("start loop", new Date());

for (let i = 0; i < 120; i++) {

    const _BOOK_ = moment(new Date()).format('YYYYMMDD') + '_' + i + '_BOOK_'
    const _TT_ = moment(new Date()).format('YYYYMMDD') + '_' + i + '_TT_'

    const _BOOK_M = sequelize.define(_BOOK_, {
        is_snapshot: Sequelize.BOOLEAN,
        order_id: Sequelize.STRING,
        price: Sequelize.FLOAT,
        amount: Sequelize.FLOAT,
        recived: Sequelize.DATE,
    });

    const _TT_M = sequelize.define(_TT_, {
        is_snapshot: Sequelize.BOOLEAN,
        order_id: Sequelize.STRING,
        price: Sequelize.FLOAT,
        amount: Sequelize.FLOAT,
        recived: Sequelize.DATE,
    });

    models.push(_BOOK_M)
    models.push(_TT_M)
}

for (let i = 0; i < 120; i++) {
    testExtress(i, i + 1)
}

function testExtress(book, trade) {

    const max = 300
    const User = models[book]
    const tt = models[trade]

    const tmp = []
    for (let index = 0; index <= 1; index++) {


        var person = User.build({
            is_snapshot: true,
            order_id: "AS5DA6S54",
            price: 3624.05,
            amount: 12.42,
            recived: new Date()
        });

        tmp.push(person)

        if (index == 1) {
            console.log("start save", new Date(), tmp.length);

            sequelize.sync()
                .then(() => User.bulkCreate(tmp))
                .then(msg => {
                    console.log("end save", new Date());
                });
        }
    }

    var tmp2 = []
    for (let index = 0; index <= max; index++) {


        var person = tt.build({
            is_snapshot: true,
            order_id: "AS5DA6S54",
            price: 3624.05,
            amount: 12.42,
            recived: new Date()
        });

        tmp2.push(person)

        if (index == max) {
            console.log("start save", new Date(), tmp2.length);

            sequelize.sync()
                .then(() => tt.bulkCreate(tmp2))
                .then(msg => {
                    console.log("end save", new Date());
                });
        }
    }

}
