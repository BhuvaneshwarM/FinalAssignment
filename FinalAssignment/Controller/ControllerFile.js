var service= require(".//..//Services");
var models=require(".//..//Models");
var alert=require('alert-node');
var crypto=require('crypto');
var path=require('path')
var Promise=require('bluebird')
var Chance=require('chance');  //Chance library used for the generation of code 
var chance=new Chance();

 function auth(req,res){
     res.sendfile(path.resolve("Views/authPage.html"));
 }  

 function login(req,res)
 {
     var login={
         username:req.query.username,
         password:req.query.password        
     }

     let isValid=service.loginValidation(login);
     if(!isValid){ 
         alert("Invalid datatype for login")
         res.redirect('/')
       }
      else{ 
          var cipher = crypto.createCipher('aes192', 'mypassword');
          let encrypt=cipher.update(login.password,'utf8','hex');
          encrypt+=cipher.final('hex');
          login.password=encrypt;
          
          var authenticate=Promise.promisify(service.authenticate);
          authenticate(login).then(userId=>{
              console.log("*******"+userId)
              res.redirect('/homepage?userId='+userId); 
          }).catch(error=>{
              
            alert(error)
            res.redirect('/')
         })      
      }
      

 }

 function signup(req,res)
 {
     var signupDetails={
         username:req.query.username,
         password:req.query.password,
         email:req.query.email,
         dob:req.query.DOB
      }
   let isValid = service.signupValidation(signupDetails);
   if(!isValid){ 
       alert("Invalid datatype for signup")
       res.redirect('/')
     }
    else{    
        var cipher = crypto.createCipher('aes192', 'mypassword');
        let encrypt=cipher.update(signupDetails.password,'utf8','hex');
        encrypt+=cipher.final('hex');
        signupDetails.password = encrypt;

        var TableEntry=Promise.promisify(service.EnterDB)
        TableEntry(signupDetails).then(userId=>{
    
        service.tokenCreation(signupDetails.username,req,res);
        res.redirect('/homepage?userId='+userId);     

        }).catch(error=>{
            alert(error)
            res.redirect('/')
        })
        
       }   
    }


 function homepage(req,res)
 {
   var userId=req.query.userId;
   if(!service.tokenChecking(req,res)){
    alert("you have not authorised yourself")
    res.redirect('/');}
   else{
        var GetCode=Promise.promisify(service.GetCode);
        GetCode(userId).then(Codes=>{
            console.log(Codes);
            res.render(path.resolve("Views/homePage.pug"), {OTP:Codes ,userId:userId})   
        })     
        
   }
   
   //if logout , delete token(middleware)
   //if otp generated with button , store in db with moment() time and date
}

function CodeGen(req,res){
    var userId=req.query.userId;
    let code=chance.integer({ min: 10000, max: 99999 })
    var CodeEntry=Promise.promisify(service.EnterCode)
    CodeEntry(code,userId).then(status=>{
        console.log(status);
        res.redirect('/homepage?userId='+userId)
    })

}

function logout(req,res){

}

 module.exports={
    auth,login,signup,homepage,CodeGen,logout
}