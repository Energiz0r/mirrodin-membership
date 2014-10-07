
(function (data) {
    var database = require("../data/database");

    function getConfigurations(next){
    }















    var seeddata = [{
        name: 'Tommy',
        configuration: [
            {
                name: "Twitter"
            },
            {
                name: 'Google calender'
            }
        ]
    }];

    function seedDatabase() {
        database.getDb(function (err, db) {
            if(err){
                console.log("Failed to seed database " + err);
            } else{
                db.configurations.count(function (err, count) {
                  if(err){
                      console.log("Failed to retrieve database count");
                  }else{
                    if (count === 0){
                        seeddata.forEach(function (item) {
                           db.configurations.insert(item, function (err) {
                               if(err){
                                   console.log("Failed to insert note into database");
                               }
                           });
                        });
                    }else{
                        console.log("Database already seeded");
                    }
                      console.log("Done seeding");
                  }
                });
            }
        });
    }

    getConfigurations();
}(module.exports));