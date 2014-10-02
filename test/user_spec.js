/*jshint expr: true*/

var should = require("should");
var User = require("../models/user");

describe("User", function(){
    describe("defaults", function(){
        var user = {};

        before(function(){
            user = new User({email: "tommykri@gmail.com"});
        });

        it("email is tommykri@gmail.com", function(){
            user.email.should.equal("tommykri@gmail.com");
        });
        it("has an authentication token", function () {
            user.authenticationToken.should.be.defined;
        });
        it("has a pending status", function () {
            user.status.should.equal('pending');
        });
        it("has created date", function () {
            user.createdAt.should.be.defined;
        });
        it("has a signInCount of 0", function () {
            user.signInCount.should.be.equal(0);
        });
        it("has currentLogin", function () {
            user.currentLoginAt.should.be.defined;
        });
    });
});