var Q = require("q");
var $ = require("jquery");
var DataGenerator = require("./data_generator");

var start_time, promises_array, numOfTasksComplete;
var number_of_objects = 10000; // Is that a lot? 😱

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

function fillListItem(data) {
  numOfTasksComplete++;
  $("#count").text("" + numOfTasksComplete + " (" + calculateTime() + " ms)");
  $("#item-" + data.id).text(data.toString());
}

$(init);
