const controller = require(".//..//Controller");


module.exports = {
    homepage: function(app) {
      app.get("/homepage", function(req, res) {
        controller.ControlF.homepage(req, res);
      });
    },
    auth:function(app){
        app.get("/",function(req,res){
            controller.ControlF.auth(req,res);
        })
    },
    login:function(app){
        app.get("/login",function(req,res){
            controller.ControlF.login(req,res);
        })
    },
    signup:function(app){
        app.get("/signup",function(req,res){
            controller.ControlF.signup(req,res);
        })
    }


};