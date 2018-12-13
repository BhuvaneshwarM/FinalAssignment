var service = require(".//..//Services");
var alert = require('alert-node');
var crypto = require('crypto');
var path = require('path')
var Promise = require('bluebird')
var Chance = require('chance');  //Chance library used for the generation of code 
var chance = new Chance();

function auth(req, res) {
    res.sendfile(path.resolve("Views/authPage.html"));
}

function login(req, res) {   //In case of login , credentials are verified and token is also created and verified from the cookies
    var login = {
        username: req.query.username,
        password: req.query.password
    }
    service.tokenCreation(login.username, req, res) //token stored in cookies
    let isValid = service.loginValidation(login); //data validation
    if (!isValid) {
        alert("Invalid datatype for login")
        res.redirect('/')
    }
    else {
        var cipher = crypto.createCipher('aes192', 'mypassword');//Password encryption
        let encrypt = cipher.update(login.password, 'utf8', 'hex');
        encrypt += cipher.final('hex');
        login.password = encrypt;

        var authenticate = Promise.promisify(service.authenticate);//login authentication
        authenticate(login).then(userId => {
            console.log("*******" + userId)
            res.redirect('/homepage?userId=' + userId);
        }).catch(error => {

            alert(error)  //A pop up alert will be given in case of msimatch
            res.redirect('/')
        })
    }


}

function signup(req, res) {
    var signupDetails = {
        username: req.query.username,
        password: req.query.password,
        email: req.query.email,
        dob: req.query.DOB
    }
    let isValid = service.signupValidation(signupDetails); //Signup data validation
    if (!isValid) {
        alert("Invalid datatype for signup")
        res.redirect('/')
    }
    else {
        var cipher = crypto.createCipher('aes192', 'mypassword'); //password encryption
        let encrypt = cipher.update(signupDetails.password, 'utf8', 'hex'); 
        encrypt += cipher.final('hex');
        signupDetails.password = encrypt;

        var TableEntry = Promise.promisify(service.EnterDB) //user credentials entry into database
        TableEntry(signupDetails).then(userId => {

            service.tokenCreation(signupDetails.username, req, res);
            res.redirect('/homepage?userId=' + userId);

        }).catch(error => {
            alert(error)
            res.redirect('/')
        })

    }
}


function homepage(req, res) {  // homepage 
    var userId = req.query.userId;
    if (!service.tokenChecking(req, res)) {   //Token checking from cookies to ensure you have gone through login or signup
        alert("you have not authorised yourself")
        res.redirect('/');
    }
    else {
        var GetCode = Promise.promisify(service.GetCode); //retriving codes from database
        GetCode(userId).then(Codes => {
            Codes = Codes.map(x => x.Code)
            console.log(Codes)
            res.render(path.resolve("Views/homePage.pug"), { OTP: Codes, userId: userId }) //sending codes to html using template engine(pug)
        })
    }
}

function CodeGen(req, res) { //Random code generation
    var userId = req.query.userId;
    let code = chance.integer({ min: 10000, max: 99999 }) //chance for 5 digit code generation
    var CodeEntry = Promise.promisify(service.EnterCode)
    CodeEntry(code, userId).then(status => {
        console.log(status);
        res.redirect('/homepage?userId=' + userId)
    })

}

function logout(req, res) {  //Token is changed to not authorized in cookie and returned to login page
    service.tokenDeletion(req, res);
    res.redirect('/');
}

module.exports = {
    auth,
    login,
    signup,
    homepage,
    CodeGen,
    logout
}