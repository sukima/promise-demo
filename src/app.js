var Q = require("q");
var $ = require("jquery");
var DataGenerator = require("./data_generator");

var promisesArray = DataGenerator.buildData(10000);
var start_time, promises_array, numOfTasksComplete;
var number_of_objects = 10000; // Is that a lot? 😱

var i, len, start_time = new Date().getTime();
for(i = 0, len = promisesArray.length; i < len; i++) {
  promisesArray[i].then(logDataObject);
}

function init() {
  numOfTasksComplete = 0;
  start_time = new Date().getTime();
  buildInitialList(number_of_objects);
  promises_array = DataGenerator.buildData(number_of_objects);
  $.each(promises_array, attachCallback);
  Q.all(promises_array).then(function() {
    var time = calculateTime();
    console.log("Completed all tasks in " + time + " ms!");
    $("#info").text("Done. " + promises_array.length + " objects processed in " + time + " ms.");
  }).done();
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

function calculateTime() {
  return (new Date().getTime()) - start_time;
}

function buildInitialList(size) {
  var i, li = $("<li/>"), list = $("#list");
  for (i = 0; i < size; i++) {
    li.clone()
      .attr("id", "item-" + i)
      .text("Pending...")
      .appendTo(list);
  }
  console.log("Initialized #list");
}

function attachCallback(index, promise) {
  promise.then(fillListItem).done();
}

function logDataObject(data)  {
  console.log(data.toString());
}

function fillListItem(data) {
  numOfTasksComplete++;
  $("#count").text("" + numOfTasksComplete + " (" + calculateTime() + " ms)");
  $("#item-" + data.id).text(data.toString());
}

console.log("Here we go!");
$(init);
