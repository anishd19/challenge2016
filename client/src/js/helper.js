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

var inIE = function(dist, area, option, cb) {
  let distData = {},
      areaType = "", c = 0;

  function foo() {
    return new Promise(function(resolve, reject) {
      // console.log("dist in Promise", dist);
      getInfoPanelData(dist, (dD) => {
        distData = dD;
        //console.log("dD", dD);
        if(++c == 2) resolve();
      });
      //console.log("area in promise", area);
      getAreaType(area, (aT) => {
        areaType = aT.areaType;
        if(++c == 2) resolve();
      });
    });
  }

  foo().then(() => {
    // console.log("distData", distData);
    // console.log("areaType", areaType);

    let eArr = distData[option];
    let eCities = eArr.map((o) => o.city);
    let eProvinces = eArr.map((o) => o.province);
    let eCountries = eArr.map((o) => o.country);

    function bar() {
      return new Promise(function(resolve, reject) {
        switch(true) {
          case areaType === "city":
            // console.log("idx is ", eCities.indexOf(area));
            // console.log("eArr idx is", eArr[eCities.indexOf(area)]);
            if(eCities.indexOf(area) > -1)
              resolve({
                result: true,
                areaType: areaType,
                tempObj: eArr[eCities.indexOf(area)]
              });
            else resolve({
              result: false,
              areaType: areaType,
              tempObj: {}
            });
            break;
          case areaType === "province":
            // console.log("idx is ", eProvinces.indexOf(area));
            // console.log("eArr idx is", eArr[eProvinces.indexOf(area)]);
            if(eProvinces.indexOf(area) > -1)
            resolve({
              result: true,
              areaType: areaType,
              tempObj: eArr[eProvinces.indexOf(area)]
            });
            else resolve({
              result: false,
              areaType: areaType,
              tempObj: {}
            });
            break;
          case areaType === "country":
            // console.log("idx is ", eCountries.indexOf(area));
            // console.log("eArr idx is", eArr[eCountries.indexOf(area)]);
            if(eCountries.indexOf(area) > -1)
            resolve({
              result: true,
              areaType: areaType,
              tempObj: eArr[eCountries.indexOf(area)]
            });
            else resolve({
              result: false,
              areaType: areaType,
              tempObj: {}
            });
            break;
          default:
            console.log("--- in default ---");
            break;
        }
      });
    }

    bar().then((result) => {
      cb(result);
    });

  });


};

var getAreaType = function(area, cb) {
  let areaType;
  db.cities.find({country: area}, function(err, docs) {
    if(docs.length === 0) {
      db.cities.find({province: area}, function(er, doc) {
        if(doc.length === 0) {
          db.cities.find({city: area}, function(e, d) {
            if(d.length === 0) {
            }else {
              areaType = "city";
              cb({
                areaType: areaType,
                doc: d
              });
            }
          });
        }else {
          areaType = "province";
          cb({
            areaType: areaType,
            doc: doc
          });
        }
      });
    }else {
      areaType = "country";
      cb({
        areaType: areaType,
        doc: docs
      });
    }
  });
};

var getParents = function(area) {
  return new Promise(function(resolve, reject) {
    let parents = [];
    let areaType = "";
    let tempObj = {};

    getAreaType(area, (aT) => {
      areaType = aT.areaType;
      db.cities.findOne({$or: [{country: area}, {city: area}, {province: area}]}, {_id: 0}, function(err, docs) {
        tempObj = docs;
        switch(areaType) {
          case "city":
            parents.push(tempObj.province);
            parents.push(tempObj.country);
            resolve({
              parents: parents,
              tempObj: tempObj,
              areaType: areaType
            });
            break;
          case "province":
            parents.push(tempObj.country);
            resolve({
              parents: parents,
              tempObj: tempObj,
              areaType: areaType
            });
            break;
          case "country":
            resolve({
              parents: parents,
              tempObj: tempObj,
              areaType: areaType
            });
            break;
          default:
            resolve({
              parents: parents,
              tempObj: tempObj,
              areaType: areaType
            });
            console.log("--- in default ---");
            break;
        }
      });
    });
  });
};

var getChildren = function(area) {
  return new Promise(function(resolve, reject) {
    let children = [];
    let areaType = "";
    let tempArr = [];

    getAreaType(area, (aT) => {
      areaType = aT;
      db.cities.find({$or: [{country: area}, {city: area}, {province: area}]}, {_id: 0}, function(err, docs) {
        tempArr = docs;
        switch(areaType) {
          case "city":
            resolve(children);
            break;
          case "province":
            tempArr.forEach(function(o, i) {
              children.push(o.city);
            });
            resolve(children);
            break;
          case "country":
            tempArr.forEach(function(o, i) {
              children.push(o.city);
              children.push(o.province);
            });
            resolve(children);
            break;
          default:
            console.log("--- in default ---");
            resolve(children);
            break;
        }
      });
    });
  });
};

var permissionChecker = function(dist, area) {
  return new Promise(function(resolve, reject) {
    inIE(dist, area, "include", (res) => {
      console.log("in A");
      if(!res.result) {
        console.log("A is false");
        console.log("in C");
        let parentsArr = [];
        getParents(area).then((pA) => {
          parentsArr = pA.parents;
          if(parentsArr.length === 0){
            console.log("C is false");
            reject();
          }
          let len = parentsArr.length, c = 0, isPresent = false, fooCalled = false;
          // console.log("len is ", len);
          parentsArr.forEach(function(v, i) {
            // console.log("v is ", v);
            inIE(dist, v, "include", (res) => {
              // console.log("res is ", res.result);
              if(res.result) {
                isPresent = true;
              }
              // console.log("isPresent in C is ", isPresent);
              if(++c === (len) && !isPresent) {
                console.log("C is false");
                reject();
              }
              if(isPresent && !fooCalled) {
                console.log("C is true");
                fooCalled = true;
                foo();
              }
            });
            //return (typeof(rV) ? true : rV);
          });

        });
      }else {
        console.log("A is true");
        foo();
      }
      function foo() {
        console.log("in Foo");
        inIE(dist, area, "exclude", (res) => {
          console.log("in D");
          if(!res.result) {
            console.log("D is false");
            console.log("in F");
            let parentsArr = [];
            let atempObj = res.tempObj;
            let aaType = res.areaType;
            getParents(area).then((pA) => {
              parentsArr = pA.parents;
              let vaType = "";
              let len = parentsArr.length, c = 0, flag = false, done = false; //flag =+> it is there
              parentsArr.forEach(function(v, i) {
                inIE(dist, v, "exclude", (res) => {
                  let bool = false;
                  // console.log("res in F is", res.tempObj);
                  vaType = res.areaType;
                  let vtempObj = res.tempObj;
                  function foobar() {
                    if(vaType === "country") {
                      if(aaType === "province") {
                          // console.log(vtempObj.province);
                          bool = (vtempObj.province === area);
                      }
                      if(aaType === "city") {
                        bool = (vtempObj.city === area);
                      }
                    }

                    if(vaType === "province") {
                      if(aaType === "city") {
                        bool = (vtempObj.city === area);
                      }
                    }
                  }
                  if(res.result && !bool && !done) {
                    flag = true;
                    done = true;
                    console.log("F is true");
                    reject();
                  }
                  ++c;
                  if(!flag && c == len) {
                    console.log("F is false");
                    console.log("in E");
                    if(aaType === "city") {
                      console.log("E is false");
                      resolve();
                    }else{
                      let childrenArr =[];
                      getChildren(area).then((cA) => {
                        childrenArr = cA;
                        let len = childrenArr.length, c=0, flag = false, donee = false; //flag ==> it is there
                        childrenArr.forEach(function(v, i) {
                          inIE(dist, v, "exclude", (re) => {
                            if(re && !done) {
                              flag = true;
                              donee = true;
                              console.log("E is true");
                              reject();
                            }
                            ++c;
                            if(!flag && !done) {
                              donee = true;
                              console.log("E is false");
                              resolve();
                            }
                          });
                        });
                      });
                    }
                  }
                });
              });
            });
          }else {
            console.log("D is true");
            reject();
          }
        });
      }
    });
  });
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
  getAllAreas: getAllAreas,
  inIE: inIE,
  getParents: getParents,
  getChildren: getChildren,
  permissionChecker: permissionChecker
};

db.cities.loadDatabase();
db.movies.loadDatabase();
