var Q = require("q");
var $ = require("jquery");
var DataGenerator = require("./data_generator");
var promiseWhile = require("./promise_while");

var start_time, numOfTasksComplete, listItems, allFulfilled;
var number_of_objects = 1000; // Is that a lot? 😱

function init() {
  $("#run-btn").click(start);
}

function start() {
  var allowFailures = $("#allow-failures").is(":checked");
  resetInfo();
  allFulfilled = true;
  numOfTasksComplete = 0;
  start_time = new Date().getTime();
  updateCount();
  Q.delay(100).then(function() {
    var waitingForInitialList = buildInitialList(number_of_objects);
    var waitingForDataGenerator = DataGenerator.buildData(number_of_objects, allowFailures);
    Q.all([waitingForInitialList, waitingForDataGenerator])
      .then(function(promises) {
        readyForOutput();
        listItems = promises[0];
        return promises[1];
      })
      .then(processData)
      .then(function(promises_array) {
        var time = calculateTime();
        console.log("Completed all tasks in " + time + " ms!");
        updateInfo("Done. " + promises_array.length + " objects processed in " + time + " ms.");
      }).done();
  });
  console.log("And go...");
}

function resetInfo() {
  $("#run-btn").prop("disabled", true);
  $("#allow-failures").prop("disabled", true);
  $("#list").empty();
  $("#loading").show();
  $("#info").hide();
  $("#run-info").hide();
}

function readyForOutput() {
  $("#loading").hide();
  $("#run-info").show();
}

function updateInfo(text) {
  $("#run-info").hide();
  $("#run-btn").prop("disabled", false);
  $("#allow-failures").prop("disabled", false);

  $("#info")
    .removeClass("fulfilled").removeClass("rejected")
    .addClass(allFulfilled ? "fulfilled" : "rejected")
    .text(text).show();
}

function calculateTime() {
  return (new Date().getTime()) - start_time;
}

function buildInitialList(size) {
  var list_items = "";
  var count = 0;

  function condition() {
    return count < size;
  }

  function worker() {
    list_items += '<div class="list-item pending">' + count + ': Pending...</div>';
    count++;
  }

  return promiseWhile(condition, worker).then(function() {
    var list = $("#list").empty().append(list_items);
    console.log("Initialized #list");
    return list.children();
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
    data = dataObjects[count].start()
      .then(fulfillListItem, failListItem);
    promises.push(data);
    count++;
  }

  return promiseWhile(condition, worker).then(function() {
    return Q.allSettled(promises);
  });
}

function fulfillListItem(item) {
  listItemInfo(item, true);
  return item;
}

function failListItem(item) {
  allFulfilled = false;
  listItemInfo(item, false);
  return item;
}

function listItemInfo(data, fulfilled) {
  numOfTasksComplete++;
  updateCount();
  $(listItems.get(data.id))
    .removeClass("pending")
    .addClass(fulfilled ? "fulfilled" : "rejected")
    .text(data.toString());

  return data;
}

function updateCount() {
  $("#count").text("" + numOfTasksComplete + " (" + calculateTime() + " ms)");
}

$(init);
