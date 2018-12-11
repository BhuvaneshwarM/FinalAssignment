

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
    Credentials.sync().then(function () {
        return Credentials.create(signup).then(function () {
            Credentials.findOne({ limit: 1, where: {}, order: [['id', 'DESC']] }).then(userId => {
                UserId = userId.id;
                callback(null,UserId);
            })
        });
    })
    return UserId;
}

function authenticate(login,callback){


}

module.exports = {
    Create, enter
}
