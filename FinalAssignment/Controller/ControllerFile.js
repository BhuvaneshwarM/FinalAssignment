var service= require(".//..//Services");

var alert=require('alert-node')
var crypto=require('crypto');
var path=require('path')
module.exports={

 auth:function(req,res){

     res.sendfile(path.resolve("Views/authPage.html"));
    
 },   

 login:function(req,res)
 {
     var login={
         username:req.query.username,
         password:req.query.password        
     }
     let isValid=service.serviceF.loginValidation(login);
     if(!isValid){ 
         alert("Invalid datatype for login")
         res.redirect('/')
       }
      else{
          
          var cipher = crypto.createCipher('aes192', 'mypassword');
          let encrypt=cipher.update(login.password,'utf8','hex');
          encrypt+=cipher.final('hex');
          login.password=encrypt;


        //find username and obtain userId and password from database. compare
        if(login.password=='23967f7ae5c1820f4bc33ffb1e3b55aa')
        {
            service.serviceF.tokenCreation(signp.username,req,res);
            res.redirect('/');
            //redirect to homepage with userId as query 
        }
          
      }
      res.end()

 },
 signup:function(req,res)
 {
     var signp={
         username:req.query.username,
         password:req.query.password,
         email:req.query.email,
         dob:req.query.DOB
      }

   let isValid=service.serviceF.signupValidation(signp);
   if(!isValid){ 
       alert("Invalid datatype for signup")
       res.redirect('/')
     }
    else{
    
        var cipher = crypto.createCipher('aes192', 'mypassword');
        let encrypt=cipher.update("someu",'utf8','hex');
        encrypt+=cipher.final('hex');
        signp.password=encrypt;
        
        service.serviceF.tokenCreation(signp.username,req,res);
        res.redirect('/homepage');
        //put username and password inside database and obtain the Id 
        
        //after obtaining the Id create token 
        
        //redirect to homepage with Id in the query 
        
       }
    res.end()





 },
 homepage:function(req,res)
 {
   let userId=req.query.userId;
   if(!service.serviceF.tokenChecking(req,res)){
    alert("you have not authorised yourself")
    res.redirect('/');}
   else{
        
    
   }
   
   //if logout , delete token(middleware)
   //if otp generated with button , store in db with moment() time and date
   
 },


}