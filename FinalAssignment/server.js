const express = require("express");
const Sequelize=require("sequelize");
const routes=require('./Routes');
const app = express();
const port = 3000;

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
})
.catch(function(err) {
  console.log("error connecting to database");
})
.done();

routes.RouteF.auth(app);

routes.RouteF.signup(app);

routes.RouteF.login(app);

routes.RouteF.homepage(app);



module.exports = app.listen(port, () =>          //Make the server listen in the port 3000
  console.log("App is listening to the port 3000")
);

