/*jshint expr: true*/

var Registration = require("../lib/registration");
var database = require("../data/database");
var assert = require("assert");
var Auth = require("../lib/authentication");
var should = require("should");

describe("Authentication", function(){
    var reg = {};
    var auth = {};
    var db = {};

    before(function (done) {
        database.getDb(function (err, database) {
            assert.ok(err === null, err);
            reg = new Registration(database);
            auth = new Auth(database);
            db = database;
            db.users.remove({}, function (err) {
                assert.ok(err === null, err);
                reg.applyForMembership({
                    email: "test@test.com",
                    password: "pass",
                    confirm: "pass"}, function (err, regResult) {
                    assert.ok(regResult.success);
                    done();
                });
            });
        });
    });
    describe("a valid login", function(){
        var authResult = {};
        before(function (done) {
            auth.authenticate({email: "test@test.com", password: "pass"}, function (err, result) {
                assert.ok(err === null, err);
                authResult = result;
                done();
            });
        });
        it("is successful", function () {
            authResult.success.should.equal(true);
        });
        it("returns a user", function () {
            authResult.user.should.be.defined;
        });
        it("creates a log entry", function () {
            authResult.log.should.be.defined;
        });
        it("updates the user stats", function () {
            authResult.user.signInCount.should.equal(2);
        });
        it("updates the signon dates", function () {
            should.exist(authResult.user.lastLoginAt);
            should.exist(authResult.user.currentLoginAt);
        });
    });
    
    describe("empty email", function(){
        var authResult = {};

        before(function (done) {
            auth.authenticate({email: null, password: "pass"}, function (err, result) {
                assert.ok(err === null, err);
                authResult = result;
                done();
            });
        });
        it("is not successful", function () {
            authResult.success.should.equal(false);
        });
        it("returns a message saying 'Invalid email or password'", function () {
            authResult.message.should.equal("Invalid email or password");
        });
    });

    describe("empty password", function(){
        var authResult = {};

        before(function (done) {
            auth.authenticate({email: "tom@tom.local", password: null}, function (err, result) {
                assert.ok(err === null, err);
                authResult = result;
                done();
            });
        });
        it("is not successful", function () {
            authResult.success.should.equal(false);
        });
        it("returns a message saying 'Invalid email or password'", function () {
            authResult.message.should.equal("Invalid email or password");
        });
    });

    describe("password dont match", function(){
        var authResult = {};

        before(function (done) {
            auth.authenticate({email: "tom@tom.local", password: "awdawdawd"}, function (err, result) {
                assert.ok(err === null, err);
                authResult = result;
                done();
            });
        });
        it("is not successful", function () {
            authResult.success.should.equal(false);
        });
        it("returns a message saying 'Invalid email or password'", function () {
            authResult.message.should.equal("Invalid email or password");
        });
    });

    describe("email not found", function(){
        var authResult = {};

        before(function (done) {
            auth.authenticate({email: "unknown@tom.local", password: "awdawdawd"}, function (err, result) {
                assert.ok(err === null, err);
                authResult = result;
                done();
            });
        });
        it("is not successful", function () {
            authResult.success.should.equal(false);
        });
        it("returns a message saying 'Invalid email or password'", function () {
            authResult.message.should.equal("Invalid email or password");
        });
    });
});
