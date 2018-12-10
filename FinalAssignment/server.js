const express = require("express");
const routes=require('./routes');
const app = express();
const port = 3000;

routes.RouteF.auth(app);

routes.RouteF.signup(app);

routes.RouteF.login(app);

routes.RouteF.homepage(app);



module.exports = app.listen(port, () =>          //Make the server listen in the port 3000
  console.log("App is listening to the port 3000")
);
