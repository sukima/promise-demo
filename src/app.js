var Q = require("q");
var $ = require("jquery");
var DataGenerator = require("./data_generator");
var promiseWhile = require("./promise_while");

var start_time, numOfTasksComplete;
var number_of_objects = 10000; // Is that a lot? 😱

function init() {
  $("#run-btn").click(start);
}

function start() {
  $("#loading").show();
  $("#run-info").hide();
  $("#info").show();
  $("#run-btn").prop("disabled", true);
  $("#list").empty();
  numOfTasksComplete = 0;
  start_time = new Date().getTime();
  updateCount();
  Q.delay(100).then(function() {
    var waitingForInitialList = buildInitialList(number_of_objects);
    var waitingForDataGenerator = DataGenerator.buildData(number_of_objects);
    Q.all([waitingForInitialList, waitingForDataGenerator])
      .then(function(promises) {
        $("#loading").hide();
        $("#run-info").show();
        return promises;
      })
      .get(1).then(processData)
      .then(function(promises_array) {
        var time = calculateTime();
        $("#run-info").hide();
        console.log("Completed all tasks in " + time + " ms!");
        $("#info").show().text("Done. " + promises_array.length + " objects processed in " + time + " ms.");
        $("#run-btn").prop("disabled", false);
      }).done();
  });
  console.log("And go...");
}

function calculateTime() {
  return (new Date().getTime()) - start_time;
}

function buildInitialList(size) {
  var count = 0, li = $("<li/>"), list = $("#list");

  function condition() {
    return count < size;
  }

  function worker() {
    li.clone()
      .attr("id", "item-" + count)
      .text("Pending...")
      .appendTo(list);
    count++;
  }

  return promiseWhile(condition, worker).then(function() {
    console.log("Initialized #list");
  });
}

function processData(dataObjects) {
  var data;
  var promises = [];
  var count = 0;
  var size = dataObjects.length;

  function condition() {
    return count < size;
  }

  function worker() {
    data = dataObjects[count].start().then(fillListItem);
    promises.push(data);
    count++;
  }

  return promiseWhile(condition, worker).then(function() {
    return Q.all(promises);
  });
}

function attachCallback(dataObject) {
  return dataObject.start().then(fillListItem);
}

function fillListItem(data) {
  numOfTasksComplete++;
  updateCount();
  $("#item-" + data.id).text(data.toString());
  return data;
}

function updateCount() {
  $("#count").text("" + numOfTasksComplete + " (" + calculateTime() + " ms)");
}

$(init);
