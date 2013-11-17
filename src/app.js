Q = require("q");
DataGenerator = require("./data_generator");

promisesArray = DataGenerator.buildData(10000);

var i, len, start_time = new Date().getTime();
for(i = 0, len = promisesArray.length; i < len; i++) {
  promisesArray[i].then(logDataObject);
}

// TODO: This should be allSettled and then loop through the results to
// determine pass or fail. This will be needed when the visual aspect of this
// project will use fulfilled and rejected states to manage the DOM.
Q.all(promisesArray).then(function(resolved) {
  console.log("All Done! 😄");
  console.log("" + resolved.length + " objects processed");
}, function(reason) {
  console.log("Something went wrong 😡");
  console.log(reason);
}).fin(function() {
  var time = new Date().getTime() - start_time;
  console.log("I only took " + time + " ms total!");
});

function logDataObject(data)  {
  console.log(data.toString());
}

console.log("Here we go!");
