/*jshint expr: true*/

var Registration = require("../lib/registration");

describe("Registration", function(){

    //Happy path
    describe("a valid application", function(){
        var regResult = {};
        before(function () {
            regResult = Registration.applyForMembership({email: "tommykri@gmail.com", password: "password", confirm: "password"});
        });
        it("is successful", function(){
            regResult.success.should.equal(true);
        });
        it("creates a user", function () {
            regResult.user.should.be.defined;
        });
        it("creates a log entry");
        it("sets the users status to approved");
        it("offers a welcome message");
    });

    describe("an empty or null email", function(){
        it("is not successful");
        it("tells user that email is required");
    });

    describe("an empty or null password", function(){
        it("is not successful");
        it("tells user that email is required");
    });

    describe("password and confirm mismatch", function(){
        it("is not successful");
        it("tells user that password don't match");
    });

    describe("email already exists", function(){
        it("is not successful");
        it("tells user that email already exists");

    });
});
