var User = require("../models/user");
var Application = require("../models/application");
var db = require("../data/database");


var RegResult = function () {
    var result = {
        success : false,
        message  : null,
        user : null
    };
    return result;
};

var validateInputs = function (app) {
    if(!app.email || !app.password){
        app.setInvalid("Email and password are required");
    } else if(app.password !== app.confirm){
        app.setInvalid("Passwords don't match");
    } else{
        app.validate();
    }
};

var checkIfUserExists = function (app, next) {
    var users = db.getDb(function (err, db) {
        var users = db.users.find({email: app.email}, function (err, items) {
            items.count(function (err, count) {
                if (count > 0){
                   app.setInvalid("Email already exists");
                   next(err, null);
                } else{
                    console.log("Does not exist");
                }
            });
        });
    });
};

exports.applyForMembership = function (args) {
    var regResult = new RegResult();
    var app = new Application(args);

    //validate imputs
    validateInputs(app);

    //Check to see if email already exists
    checkIfUserExists(app);
    //Hash password

    if(app.isValid()){
        regResult.success = true;
        regResult.message = "Welcome!";
        regResult.user = new User(args);
    }

    return regResult;
};
