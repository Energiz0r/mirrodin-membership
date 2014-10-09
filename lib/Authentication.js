var events = require("events");
var util = require("util");
var assert = require("assert");
var bc = require("bcrypt-nodejs");
var User = require("../models/user");
var Log = require("../models/log");

var AuthResult = function (credentials) {
    return {
        creds: credentials,
        success: false,
        message: "Invalid email or password",
        user: null,
        log: null
    };
};

var Authentication = function (db) {
    var self = this;
    var continueWith = null;
    events.EventEmitter.call(self);

    //validate credentials
    var validateCredentials = function (authResult) {
        if(authResult.creds.email && authResult.creds.password){
            self.emit("creds-ok", authResult);
        } else {
            self.emit("invalid", authResult);
        }
    };

    //find user
    var findUser = function (authResult) {
        console.log(authResult.creds.email);
        db.users.findOne({email: authResult.creds.email}, function (err, result) {
            assert.ok(err === null, err);
            if(result){
                authResult.user = new User(result);
                self.emit("user-found", authResult);
            } else {
                self.emit("invalid", authResult);
            }
        });
    };
    //compare password
    var comparePasswords = function (authResult) {
        var matched = bc.compareSync(authResult.creds.password, authResult.user.hashedPassword);
        if(matched){
            self.emit("password-accepted", authResult);
        }else{
            self.emit("invalid", authResult);
        }
    };

    var updateUserStatus = function (authResult) {
        var user = authResult.user;
        user.signInCount++;
        user.lastLoginAt = user.currentLoginAt;
        user.currentLoginAt = new Date();

        var updates = {
            signInCount : user.signInCount,
            lastLoginAt : user.lastLoginAt,
            currentLoginAt : user.currentLoginAt
        };
        db.users.update({email: user.email}, {$set: updates}, function (err, result) {
            assert.ok(err === null, err);

            self.emit("user-updated", authResult);
        });
    };

    //create log entru
    var createLogEntry = function (authResult) {
        var log = new Log({
            subject: "Authentivation",
            userId: authResult.user.email,
            entry: "Successfully logged in"
        });

        db.logs.insert(log, function (err, result) {
            authResult.log = result;
            self.emit("log-created", authResult);
        });
    };

    var authenticatedOk = function (authResult) {
        authResult.success = true;
        authResult.message = "Welcome!";
        if(continueWith){
            continueWith(null, authResult);
        }
        self.emit("completed", authResult);
    };

    var authNotOk = function (authResult) {
        authResult.success = false;
        if(continueWith){
            continueWith(null, authResult);
        }
        self.emit("completed", authResult);
    };

    //happy paht
    self.on("login-received", validateCredentials);
    self.on("creds-ok", findUser);
    self.on("user-found", comparePasswords);
    self.on("password-accepted", updateUserStatus);
    self.on("user-updated", createLogEntry);
    self.on("log-created", authenticatedOk);
    self.on("invalid", authNotOk);

    self.authenticate = function (credentials, next) {
        continueWith = next;
        var authResult = new AuthResult(credentials);
        self.emit("login-received", authResult);
    };

    return self;
};

util.inherits(Authentication, events.EventEmitter);
module.exports = Authentication;

