

var Sequelize = require('sequelize')

var Credentials;
var OTP;
function Create(sequelize) {
    Credentials = sequelize.define('Credentials', {
        username: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        dob: Sequelize.STRING,
    })

    OTP = sequelize.define("OTP", {
        Code: { type: Sequelize.STRING }
    });

    OTP.belongsTo(Credentials);
    Credentials.sync().then(function () {
        console.log("credentials table created")
        OTP.sync().then(function () {
            console.log("OTP table created")
        })

    })
}

function enter(signup,callback) {
    let UserId;
    Credentials.findOne({limit:1,where:{username:signup.username}}).then(userDetails=>{ 
        if(userDetails!= null){ callback("username already taken",null);}        
     else{
    Credentials.sync().then(function () {
        return Credentials.create(signup).then(function () {
            Credentials.findOne({ limit: 1, where: {}, order: [['id', 'DESC']] }).then(userId => {
                UserId = userId.id;
                callback(null,UserId);
            })
        });
    })} })
    
}

function enterCodeDB(code,userId,callback)
{
    OTP.sync().then(function(){
        
        return OTP.create({Code:code,CredentialId:userId}).then(()=>{
            callback(null,"otp entered");
        })
    })
}

function authenticate(login,callback){

Credentials.findOne({limit:1,where:{username:login.username}}).then(userDetails=>{
    console.log(userDetails.username,login.username ,userDetails.password,login.password)
    if(userDetails.username == login.username && userDetails.password == login.password)
    {
     console.log("********************credentials are correct");
       callback(null,userDetails.id); 
   
}
else{
    console.log("********************credentials are wrong");
    callback("entered credentials not matching",null);
}
}
).catch(()=>{
    console.log("user not available")
    callback("not able to find the entered username",null);
   })
}

module.exports = {
    Create, enter,authenticate,enterCodeDB
}
