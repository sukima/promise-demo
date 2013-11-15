DataGenerator = require("./data_generator");

promisesArray = DataGenerator.buildData(100);

var i, len;
for(i = 0, len = promisesArray.length; i < len; i++) {
  promisesArray[i].then(logDataObject);
}

function logDataObject(data)  {
  console.log(data.toString());
}

console.log("Here we go!");
