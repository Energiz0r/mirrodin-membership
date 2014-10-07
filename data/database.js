
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
                        users: db.collection("users"),
                        logs: db.collection("logs")
                    };
                    next(null, theDb);
                }
            });
        }
    };




//    function seedDatabase() {
//        database.getDb(function (err, db) {
//            if(err){
//                console.log("Failed to seed database " + err);
//            } else{
//                db.users.count(function (err, count) {
//                    if(err){
//                        console.log("Failed to retrieve database count");
//                    }else{
//                        if (count < 3){
//                            [{name: 'Tommy'}].forEach(function (item) {
//                                db.users.insert(item, function (err) {
//                                    if(err){
//                                        console.log("Failed to insert note into database");
//                                    }
//                                });
//                            });
//                        }else{
//                            console.log("Database already seeded");
//                        }
//                        console.log("Done seeding");
//                    }
//                });
//            }
//        });
//    }
//    seedDatabase();
}(module.exports));
