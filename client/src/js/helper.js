/*jshint esversion: 6*/

var assert = require('assert');

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
};

var loadDummyDB = function(cb) {
  let temp = [], i  = 0;
  function foo(){
    return new Promise(function(resolve, reject) {
      createDistObj("admin", "distributor1", ["India", "United States"], ["Karnataka", "Chennai"]).then((o) => {temp.push(o); i++; if(i==3) resolve();}, (e) => console.error(e));
      createDistObj("distributor1", "distributor2", ["India"], ["Tamil Nadu"]).then((o) => {temp.push(o); i++; if(i==3) resolve();}, (e) => console.error(e));
      createDistObj("", "distributor3", [], []).then((o) => {temp.push(o); i++; if(i==3) resolve();}, (e) => console.error(e));
    });
  }
  foo().then(() => {
    db.movies.insert(temp, (err,docs) => {
      if(err) console.error(err);
    });
    cb();
  });
};

var viewDB = function(name) {
  db[name].find({}, function(err, docs) {
    console.log(docs);
  });
};

var getSubDist = function(user, cb, possDist) {
  assert.ok(user);
  let subDist = [];
  if(user == "admin") {
    subDist = ["distributor1", "distributor2", "distributor3"];
    cb(null, subDist);
  }else {
    if(possDist === true){
      db.movies.find({$or: [{authBy: user}, {authBy: ''}]}, {_id: 0, name: 1}, function(err, docs) {
        docs.map((o) => subDist.push(o.name));
        if(subDist[0] === user) subDist = [];
        cb(err, subDist);
      });
    }else {
      db.movies.find({authBy: user}, {_id: 0, name: 1}, function(err, docs) {
        docs.map((o) => subDist.push(o.name));
        cb(err, subDist);
      });
    }

  }
};

var getInfoPanelData = function(user, cb) {
  db.movies.find({name: user}, {_id:0, authBy:0}, function(err, docs) {
    cb(docs[0]);
  });
};

var getAllAreas = function(cb) {
  console.log("at getAllAreas");
  let arr = [];
  function insertIntoArr(str) {
    if(arr.indexOf(str) < 0) {
      arr.push(str);
    }
  }

  function foo() {
    let temp = [{city: 1, _id: 0}, {province: 1, _id: 0}, {country: 1, _id: 0}];
    let k = 0;
    return new Promise(function(resolve, reject) {
      temp.forEach(function(v, i) {
        db.cities.find({}, v, function(err, docs) {
          if(err) console.error(err);
          docs.forEach(function(va, ind) {
            if(!!va.city) insertIntoArr(va.city);
            else if(!!va.province) insertIntoArr(va.province);
            else if(!!va.country) insertIntoArr(va.country);
          });
          if(++k === 3) resolve();
        });
      });
    });
  }

  foo().then(() => {
    cb(arr);
    console.log("all areas loaded");
  });
};

var isItincluded = function(dist, area) {

};

var isItExcluded = function(dist, area) {

};

var createDistObj = function(fromUser, toUser, include, exclude) {
  var distObj = {
    name: toUser,
    include: [],
    exclude: [],
    authBy: fromUser
  };

  var i = 0, j = 0, k = include.length, l = exclude.length;



  return new Promise(function(resolve, reject) {

    include.forEach(function(v, index, arr) {
      try{
        getOneFromCities(v, function(obj) {
          i++;
          if(i == k && j == l) {
            resolve(distObj);
          }
          distObj.include.push(createElem(obj));
        });
      }catch(err) {
        console.error(err.message);
      }
    });

    exclude.forEach(function(v, index, arr) {
      try{
        getOneFromCities(v, function(obj) {
          j++;
          if(i == k && j == l) {
            resolve(distObj);
          }
          distObj.exclude.push(createElem(obj));
        });
      }catch(err) {
        console.error(err.message);
      }
    });

    if(k === 0 || l ===0)
      resolve(distObj);
});
};

var getOneFromCities = function(searchItem, cb) {
  db.cities.findOne({$or: [{city:searchItem}, {province:searchItem}, {country:searchItem}]}, {_id: 0}, function(err, docs) {
    var type = "";

    if(err){
      console.log(err.message);
    }

    if(!docs) {
      throw new Error("docs is null, Check searchItem");
    }

    if(docs.city === searchItem) type = "city";
    else if(docs.province === searchItem) type = "province";
    else if(docs.country === searchItem) type = "country";

    cb({
      type: type,
      docs: docs
    });
  });
};

var createElem = function(obj) {
  if(obj.type === "country") {
    obj.docs.province = "all";
    obj.docs.city = "all";
  }else if(obj.type === "province") {
    obj.docs.city = "all";
  }
  return obj.docs;
};

module.exports = {
  initiateDB: initiateDB,
  loadDummyDB: loadDummyDB,
  viewDB: viewDB,
  getSubDist: getSubDist,
  getInfoPanelData: getInfoPanelData,
  getAllAreas: getAllAreas
};

//initiateDB();

db.cities.loadDatabase();
db.movies.loadDatabase();
