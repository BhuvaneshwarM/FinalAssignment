var Sequelize = require('sequelize')
var moment = require('moment');
var CurrentTime = moment();
var expiryTime = CurrentTime.subtract({ 'minutes': 180 })
var Credentials;
var OTP;
function Create(sequelize) {   //Creating the database models
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

function enter(signup, callback) { //entering user credentials into DB and ensuring that no username is taken twice to avoid conflict
    let UserId;
    Credentials.findOne({ limit: 1, where: { username: signup.username } }).then(userDetails => {
        if (userDetails != null) { callback("username already taken", null); }
        else {
            Credentials.sync().then(function () {
                return Credentials.create(signup).then(function () {
                    Credentials.findOne({ limit: 1, where: {}, order: [['id', 'DESC']] }).then(userId => {
                        UserId = userId.id;
                        callback(null, UserId);
                    })
                });
            })
        }
    })

}


function authenticate(login, callback) { //authenticate user credentials during login

    Credentials.findOne({ limit: 1, where: { username: login.username } }).then(userDetails => {
        console.log(userDetails.username, login.username, userDetails.password, login.password)
        if (userDetails.username == login.username && userDetails.password == login.password) {
            console.log("********************credentials are correct");
            callback(null, userDetails.id);

        }
        else {
            console.log("********************credentials are wrong");
            callback("entered credentials not matching", null);
        }
    }
    ).catch(() => {
        console.log("user not available")
        callback("not able to find the entered username", null);
    })
}

function enterCodeDB(code, userId, callback) { //Entering code into DB
    OTP.sync().then(function () {

        return OTP.create({ Code: code, CredentialId: userId }).then(() => {
            callback(null, "otp entered");
        })
    })
}
function GetCode(userId, callback) { //fetch code from DB

    OTP.findAll({
        raw: true, attributes: ['Code'],
        where: { CredentialId: userId, createdAt: { [Sequelize.Op.gte]: expiryTime } },
        order: [['createdAt', 'DESC']]
    }).then(Codes => {

        callback(null, Codes)
    })


}
module.exports = {
    Create,
    enter, authenticate,
    GetCode,
    enterCodeDB
}
