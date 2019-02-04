const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = new Sequelize('qubinance', 'qu', '83qx8J8HYAmQPkw', {
    host: 'qubinance.cj2ppx936tun.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const tablename = moment(new Date()).format('YYYYMMDD') + '_dolj19_incremental'

const User = sequelize.define(tablename, {
    is_snapshot: Sequelize.BOOLEAN,
    order_id: Sequelize.STRING,
    price: Sequelize.FLOAT,
    amount: Sequelize.FLOAT,
    recived: Sequelize.DATE,
});

sequelize.sync()
    .then(() => User.create({
        is_snapshot: true,
        order_id: "AS5DA6S54",
        price: 3624.05,
        amount: 12.42,
        recived: new Date()
    }))
    .then(jane => {
        console.log(jane.toJSON());
    });


sequelize.sync()
    .then(() => User.create({
        is_snapshot: true,
        order_id: "AS5DA6S54",
        price: 3624.05,
        amount: -12.42,
        recived: new Date()
    }))
    .then(jane => {
        console.log(jane.toJSON());
    });

