var User = require("../models/user");
var Application = require("../models/application");
var db = require("../data/database");
var assert = require("assert");
var bcrypt = require("bcrypt-nodejs");
var Log = require("../models/log");
var Emitter = require("events").EventEmitter;
var util = require("util");

var RegResult = function () {
    return {
        success : false,
        message  : null,
        user : null
    };
};
var Registration = function(db){
    Emitter.call(this);
    var self = this;
    var continueWith = null;

    var validateInputs = function (app) {
        if(!app.email || !app.password){
            app.setInvalid("Email and password are required");
            self.emit("invalid", app);
        } else if(app.password !== app.confirm){
            app.setInvalid("Passwords don't match");
            self.emit("invalid", app);
        } else{
            app.validate();
            self.emit("validated", app);
        }
    };

    var checkIfUserExists = function (app) {
        db.users.find({email: app.email}, function (err, items) {
            items.count(function (err, count) {
                assert.ok(err === null, err);
                if (count > 0){
                    app.setInvalid("This email already exists");
                    self.emit("invalid", app);
                } else{
                    self.emit("user-dosent-exist", app);
                }
            });
        });
    };

    var createUser = function (app) {
        var user = new User(app);
        user.status = "approved";
        user.signInCount = 1;
        user.password = bcrypt.hashSync(app.password);
        db.users.insert(user, function (err, newUsers) {
            assert.ok(err === null, err);
            app.user = newUsers[0];
            self.emit("user-created", app);
        });
    };
    
    var addLogEntry = function (app) {
        var log = new Log({
            subject: "Registration",
            userId: app.user._id,
            entry: "Successfully Registered"
        });
        db.logs.insert(log, function (err, newLog) {
            app.log = newLog;
            self.emit("log-created", app);
        });
    };

    var registrationOk = function (app) {
        var regResult = new RegResult();
        regResult.success = true;
        regResult.message = "Welcome!";
        regResult.user = app.user;
        regResult.log = app.log;

        if(continueWith){
            continueWith(null, regResult);
        }
    };

    var registrationNotOk = function (app) {
        var regResult = new RegResult();
        regResult.success = false;
        regResult.message = app.message;
        if(continueWith){
            continueWith(null, regResult);
        }
    };

    self.applyForMembership = function (args, next) {
        continueWith = next;
        var app = new Application(args);
        self.emit("application-received", app);
    };

    //Happy path
    self.on("application-received", validateInputs);
    self.on("validated", checkIfUserExists);
    self.on("user-dosent-exist", createUser);
    self.on("user-created", addLogEntry);
    self.on("log-created", registrationOk);

    //Bummer path
    self.on("invalid", registrationNotOk);

    return self;
};

util.inherits(Registration, Emitter);
module.exports = Registration;