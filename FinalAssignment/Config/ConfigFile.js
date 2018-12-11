const Sequelize = require("sequelize");
var path = require('path')
const createTable = require(path.resolve('./Models'))

const sequelize = new Sequelize('postgres', 'bhuvanesh', 'testpass', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
  })

  var test = sequelize //Checking if the databse is connected
.authenticate()
.then(function() {
  console.log("CONNECTED! ");

createTable.Create(sequelize) //To create user credentials and OTP details
})
.catch(function(err) {
  console.log("error connecting to database");
})
.done();


