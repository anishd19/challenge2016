/*jshint esversion: 6*/

const fs = require('fs');
const readline = require('readline');
const process = require('process');

const selectCountries = ["India", "United States", "Canada", "Japan", "China", "Pakistan", "Bangladesh", "Sri Lanka"];

const inputFile = process.argv[2] || 'dummy.csv';
const outputFile = process.argv[3] || 'dummy.json';

const instream = fs.createReadStream(inputFile);

const rl = readline.createInterface({
  input: instream
});

var i = 1;
var indexArray = [];

var writeDataToFile = function(data, type) {
  let writeAction = type === 0 ? fs.writeFile : fs.appendFile;
  writeAction(outputFile, data, function(err) {
    if(err) console.error("Write error: " , err.message);
  });
};

var parser = function(data, requiredFields, criterion, customIndices) {
  console.log("data", data);
  console.log("requiredFields", requiredFields);
  console.log("criterion", criterion);
  console.log("customIndices", customIndices);
  console.log("indexArray", indexArray);
  console.log("==============================================");

  let tempArr = data.split(",");
  console.log("tempArr", tempArr);

  if(i === 1) {
    console.log("Started Parsing");
    tempArr.forEach(function(v, i, arr) {
      if(requiredFields.indexOf(v) > -1)
        indexArray.push(i);
    });
  }else if(criterion){
    let tempObj = {};
    indexArray.forEach(function(v, i, arr) {
      tempObj[customIndices[i]] = tempArr[v];
    });
    var d = JSON.stringify(tempObj);
    if (d != '{}') {
        if(i==2) {
            writeDataToFile('\t\t' + d, 1);
        } else {
            writeDataToFile(',\n\t\t' + d, 1);
        }
    }
  }
  i++;
};

writeDataToFile('{\n\"citiesdb\":[\n', 0);

rl.on('line', (line) => {
  const requiredFields = ["City Name", "Province Name", "Country Name"];
  const customIndices = ["city", "province", "country"];
  var criterion = function() {
    var l = line.toString('utf8').split(",")[5];
    return (selectCountries.indexOf(l) > -1);
  };
  parser(line, requiredFields, criterion(), customIndices);
}).on('close', () => {
  writeDataToFile('\n\t]\n}', 1);
  console.log("parsing done");
});
