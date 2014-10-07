var events = require("events");
var util = require("util");

var Authentication = function () {
    var self = this;


    events.EventEmitter.call(self);
};

util.inherits(Authentication, events.EventEmitter);
module.exports = Authentication;

