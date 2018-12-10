var Ajv=require('ajv');
var {plugin}=require('ajv-moment')
var moment=require('moment')
var jwt=require('jsonwebtoken');
var Cookies = require('cookies')
var ajv=new Ajv();
plugin({ajv,moment});
module.exports={

    signupValidation:function(signp){
    let schema={
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
    const isValid=ajv.validate(schema,signp);  
    return isValid
    },

    loginValidation:function(login){
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

    },

    tokenCreation:function(user,req,res){
        let token= jwt.sign({username:user},"TokenKey");
     let keys = ['cookie key']
     let cookies = new Cookies(req, res, { keys: keys })
     cookies.set('AuthenticatedToken',token, { signed: true })
     //var lastVisit = cookies.get('LastVisit', { signed: true }
    },

    tokenChecking:function(req,res)
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
   },

   tokenDeletion:function(){
    var keys = ['cookie key']
    var cookies = new Cookies(req, res, { keys: keys })
    cookies.set('AuthenticatedToken',"not authenticated", { signed: true })
   }


}