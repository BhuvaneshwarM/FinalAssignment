var service= require(".//..//Services");
var models=require(".//..//Models");
var alert=require('alert-node');
var crypto=require('crypto');
var path=require('path')
var Promise=require('bluebird')


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
              res.redirect('/homepage?UserId='+userId); 
          }).catch(error=>{
              
            alert(error)
            res.redirect('/')
         })
        //find username and obtain userId and password from database. compare
        /*if(login.password=='23967f7ae5c1820f4bc33ffb1e3b55aa')
        {
            service.tokenCreation(signp.username,req,res);
            res.redirect('/');
            //redirect to homepage with userId as query 
        }*/
          
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
        res.redirect('/homepage?UserId='+userId);     
           
        }).catch(error=>{
            alert(error)
            res.redirect('/')
        })
        
       }
    
    }


 function homepage(req,res)
 {
   let userId=req.query.userId;
   if(!service.tokenChecking(req,res)){
    alert("you have not authorised yourself")
    res.redirect('/');}
   else{
        res.end()
    
   }
   
   //if logout , delete token(middleware)
   //if otp generated with button , store in db with moment() time and date
   
 }

 module.exports={
    auth,login,signup,homepage
}