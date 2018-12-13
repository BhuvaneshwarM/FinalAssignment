const express = require("express");
const connection = require('./Config')
const routes = require('./Routes');



const app = express();
const port = 3000;
app.set('view engine', 'pug')

routes.auth(app);

routes.signup(app);

routes.login(app);

routes.homepage(app);

routes.OTP(app);

routes.logout(app);

module.exports = app.listen(port, () =>          //Make the server listen in the port 3000
  console.log("App is listening to the port 3001")
);

