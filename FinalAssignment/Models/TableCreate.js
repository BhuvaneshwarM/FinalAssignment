var path=require('path')

var Sequelize=require('sequelize')

function Create(sequelize){    
    const Credentials = sequelize.define('Credentials', {
        username: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        dob: Sequelize.STRING,
      })
      const OTP = sequelize.define("OTP", {//defining projects model
        Code: { type: Sequelize.STRING }
      });
      
      OTP.belongsTo(Credentials);
    Credentials.sync().then(function(){
        console.log("credentials table created")
        OTP.sync().then(function(){
            console.log("OTP table created")
        })
    })
    
    


    }

module.exports={
    Create,


}
