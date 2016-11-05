/*jshint esversion: 6*/

var Datastore = require('nedb'),
    citiesJson = require('../assets/cities.json');

var db = {};
db.cities = new Datastore();
db.movies = new Datastore();

var initiateDB = function() {
    console.log("initiating DB");

    let adminObj = {
        name: 'admin',
        include: [{
            city: 'all',
            province: 'all',
            country: 'all'
        }],
        exclude: [],
        authBy: 'sudo'
    };
    db.cities.insert(citiesJson.citiesdb);
    db.movies.insert(adminObj);
    db.movies.find({}, function(err, docs) {
      console.log(docs);
    });
    db.cities.find({city:"Punch"}, function(err, docs){
      console.log(docs);
    });
};

var loadDummyDB = function() {
  let temp = [];
};

var getSubDist = function(user) {

};



module.exports = {
  initiateDB: initiateDB
};

//initiateDB();

db.cities.loadDatabase();
db.movies.loadDatabase();
