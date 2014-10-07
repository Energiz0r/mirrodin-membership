
(function (database) {
    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://localhost:27017/mirrodin";
    var theDb = null;

    database.getDb = function (next) {
        if(!theDb){
            //connect to db
            mongodb.MongoClient.connect(mongoUrl, function (err, db) {
                if (err){
                    console.log("Error connection to the db: " + err);
                    next(err, null);
                } else {
                    theDb = {
                        db: db,
                        users: db.collection("users")
                    };
                    next(null, theDb);
                }
            });
        }
    };
}(module.exports));
