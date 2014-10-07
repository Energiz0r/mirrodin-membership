/*jshint expr: true*/

var Registration = require("../lib/registration");
var database = require("../data/database");
var assert = require("assert");
var Auth = require("../lib/authentication");

describe("Authentication", function(){
    var reg = {};
    var auth = {};
    var db = {};

    before(function (done) {
        database.getDb(function (err, database) {
            reg = new Registration(database);
            auth = new Auth(database);
            db = database;
            done();
        });
    });
    describe("a valid login", function(){
        before(function (done) {
            db.users.remove({}, function (err, result) {
                reg.applyForMembership({
                    email: "test@test.com",
                    password: "pass",
                    confirm: "pass"}, function (err, result) {
                    assert.ok(result.success);
                    done();
                });
            });
        });
        it("is successful");
        it("returns a user");
        it("creates a log entry");
        it("updates the user stats");
        it("updates the signon dates");

    });
    
    describe("empty email", function(){
        it("is not successful");
        it("returns a message saying 'Invalid login'");

    });

    describe("empty password", function(){
        it("is not successful");
        it("returns a message saying 'Invalid login'");
    });

    describe("password dont match", function(){
        it("is not successful");
        it("returns a message saying 'Invalid login'");
    });

    describe("email not found", function(){
        it("is not successful");
        it("returns a message saying 'Invalid login'");
    });
});
