/*jshint expr: true*/

var Registration = require("../lib/registration");
var database = require("../data/database");
var assert = require("assert");

describe("Registration", function(){
    var reg = {};
    var db = {};

    before(function (done) {
        database.getDb(function (err, database) {
            assert.ok(err === null, err);

            reg = new Registration(database);
            db = database;
            done();
        });
    });

    describe("a valid application", function(){
        var regResult = {};
        console.log(db);
        before(function (done) {
            db.users.remove({}, function (err, result) {
                reg.applyForMembership({
                    email: "tommykri@gmail.com",
                    password: "password",
                    confirm: "password"}, function (err, result) {
                    regResult = result;
                    done();
                });
            });
        });
        it("is successful", function(){
            regResult.success.should.equal(true);
        });
        it("creates a user", function () {
            regResult.user.should.be.defined;
        });
        it("creates a log entry", function () {
            regResult.log.should.be.defined;
        });
        it("sets the users status to approved", function () {
            regResult.user.status.should.equal("approved");
        });
        it("offers a welcome message", function () {
            regResult.message.should.equal("Welcome!");
        });
        it("increments the signInCount", function () {
            regResult.user.signInCount.should.equal(1);
        });
    });

    describe("an empty or null email", function(){
        var regResult = {};
        before(function (done) {
            reg.applyForMembership({
                email: null,
                password: "awdawd",
                confirm: "awdawd"}, function (err, result) {
                regResult = result;
                done();
            });
        });
        it("is not successful", function () {
            regResult.success.should.equal(false);
        });
        it("tells user that email is required", function () {
            regResult.message.should.equal("Email and password are required");
        });
    });

    describe("an empty or null password", function(){
        var regResult = {};
        before(function (done) {
            reg.applyForMembership({
                email: "tom@tim.local",
                password: null,
                confirm: "password"}, function (err, result) {
                regResult = result;
                done();
            });
        });
        it("is not successful", function () {
            regResult.success.should.equal(false);
        });
        it("tells user that email is required", function () {
            regResult.message.should.equal("Email and password are required");
        });
    });

    describe("password and confirm mismatch", function(){
        var regResult = {};
        before(function (done) {
            reg.applyForMembership({
                email: "tom@tim.local",
                password: "awddwa",
                confirm: "password"}, function (err, result) {
                regResult = result;
                done();
            });
        });
        it("is not successful", function () {
            regResult.success.should.equal(false);
        });
        it("tells user that passwords dont match", function () {
            regResult.message.should.equal("Passwords don't match");
        });
    });

    describe("email already exists", function(){
        var regResult = {};
        var newUser = {email: "tom@tim.local",password: "password", confirm: "password"};
        before(function (done) {
            db.users.remove({}, function (err, result) {
                reg.applyForMembership(newUser, function (err, result) {
                    reg.applyForMembership(newUser, function (err, result) {
                        regResult = result;
                        done();
                    });
                });
            });
        });
        it("is not successful", function () {
            regResult.success.should.equal(false);
        });
        it("tells user that email already exists", function () {
            regResult.message.should.equal("This email already exists");
        });
    });
});