var Ajv = require('ajv');
var {plugin} = require('ajv-moment')
var moment = require('moment')
var jwt = require('jsonwebtoken');
var Cookies = require('cookies')
var path = require('path')
var Tables = require(path.resolve('./Models'))
var Promise = require("bluebird");


var ajv=new Ajv();
plugin({ajv,moment});

    function signupValidation(signup){
    let schema = {
        "type":"object",
        "properties":{
            "username":{"type":"string"},
            "password":{"type":"string"},
            "email":{"type":"string","format":"email"},
            "dob":{"type":"string","moment": {
                "format": ["DD/MM/YYYY"]
            }}
            
        },
        "required": ["username","password","email","dob"] 
    }
    const isValid=ajv.validate(schema,signup);  
    return isValid
    }

    function loginValidation(login){
        let schema={
            "type":"object",
            "properties":
            {
                "username":{"type":"string"},
                "password":{"type":"string"}
            },"required":["username","password"]
        }
    let isValid=ajv.validate(schema,login);
    return isValid

    }

    function tokenCreation(user,req,res){
        let token= jwt.sign({username:user},"TokenKey");
     let keys = ['cookie key']
     let cookies = new Cookies(req, res, { keys: keys })
     cookies.set('AuthenticatedToken',token, { signed: true })
    }

    function tokenChecking(req,res)
    {
        let keys = ['cookie key']
        let cookies = new Cookies(req, res, { keys: keys })
        let token = cookies.get('AuthenticatedToken', { signed: true })
        let isValid;
        jwt.verify(token,"TokenKey",function(err,data){ 
            if(!err){
                isValid=true
               }
            else{      
                isvalid=false                                
               }
        }) 
        return isValid
   }

   function tokenDeletion(){
    var keys = ['cookie key']
    var cookies = new Cookies(req, res, { keys: keys })
    cookies.set('AuthenticatedToken',"not authenticated", { signed: true })
   }
    
  function EnterDB(signup,callbac){
     
      let Credentials= Tables.Credentials;
      let OTP=Tables.OTP;
      let userId;
      var TableEntry = Promise.promisify(Tables.enter);
      TableEntry(signup).then(data=>{
          callbac(null,data);
    }).catch(error=>{callbac(error,null)})     
    }

    function authenticate(login,callback)
    {
        var authenticat=Promise.promisify(Tables.authenticate)
        authenticat(login).then(Userid=>{
            callback(null,Userid);
        }).catch(error=>{
           
            callback(error,null)
        })
        
    }

   module.exports = {
    signupValidation,loginValidation,tokenChecking,tokenCreation,tokenDeletion,EnterDB,authenticate
}