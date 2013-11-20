// PromiseController - Control the building and displaying of data objects
var Q = require("q");
var $ = require("jquery");
var DataGenerator = require("./data_generator");
var promiseWhile = require("./promise_while");

// PromiseController {{{1
function PromiseController() {
  this.controls = {
    run_button:    $("#run-btn"),
    allow_failues: $("#allow-failures"),
    data_size:     $("#data-size")
  };
  this.info_divs = {
    live_update: $("#run-info"),
    count:       $("#count"),
    summary:     $("#info")
  };
  this.loading_overlay = $("#loading");
  this.content_list = $("#list");
}


// PromiseController::init {{{1
PromiseController.prototype.init = function init() {
  this.controls.run_button.click($.proxy(this, "start"));
  // $("#notice").dialog();
  return this;
};


// PromiseController::allowFailures {{{1
PromiseController.prototype.allowFailures = function allowFailures() {
  return this.controls.allow_failues.is(":checked");
};


// PromiseController::dataSetSize {{{1
PromiseController.prototype.dataSetSize = function dataSetSize() {
  return this.controls.data_size.val();
};


// PromiseController::enableControls {{{1
PromiseController.prototype.enableControls = function enableControls() {
  for (var control in this.controls) {
    this.controls[control].prop("disabled", false);
  }
  return arguments[0];
};


// PromiseController::disableControls {{{1
PromiseController.prototype.disableControls= function disableControls() {
  for (var control in this.controls) {
    this.controls[control].prop("disabled", true);
  }
  return arguments[0];
};


// PromiseController::showLoading {{{1
PromiseController.prototype.showLoading = function showLoading() {
  this.loading_overlay.show();
  return arguments[0];
};


// PromiseController::hideLoading {{{1
PromiseController.prototype.hideLoading = function hideLoading() {
  this.loading_overlay.hide();
  return arguments[0];
};


// PromiseController::finish {{{1
PromiseController.prototype.finish = function finish() {
  this.hideLoading();
  this.enableControls();
};


// PromiseController::validateDataSize {{{1
PromiseController.prototype.validateDataSize = function validateDataSize() {
  var size = this.dataSetSize();
  if (size >= 90000) {
    return promiseConfirmation("Gulp! I really think that is too high. Blue smoke will probubly come out the back of your computer! Are you absolutly sure?");
  }
  if (size >= 50000) {
    return promiseConfirmation("Whoa Nelly! That's a lot! The browser will probubly cry. Are you really sure you want to do this?");
  }
  if (size >= 10000) {
    return promiseConfirmation("That's getting a little heavy. Are you sure you want to bog your browser down?");
  }
  return Q("Data size ok");
};


// PromiseController::buildDom {{{1
PromiseController.prototype.buildDom = function buildDom() {
  var _this = this;
  var list_items = "";
  var count = 0;
  var size = this.dataSetSize();

  function condition() {
    return count < size;
  }

  function worker() {
    list_items += '<div class="list-item pending">' + count + ': Pending...</div>';
    count++;
  }

  return promiseWhile(condition, worker).then(function() {
    _this.content_list.empty().append(list_items);
    return _this.content_list.children();
  });
};


// PromiseController::generateData {{{1
PromiseController.prototype.generateData = function generateData() {
  return DataGenerator.buildData(this.dataSetSize(), this.allowFailures());
};


// PromiseController::execute {{{1
PromiseController.prototype.execute = function execute(data_set) {
  var _this        = this;
  var count        = 0;
  var size         = data_set.length;
  var final_result = true;
  var defer        = Q.defer();
  var promises     = [];
  var promise;

  function pass(data) {
    defer.notify(data);
  }

  function fail(data) {
    final_result = false;
    defer.notify(data);
  }

  function condition() {
    return count < size;
  }

  function worker() {
    promise = data_set[count].start();
    promise.then(pass, fail);
    promises.push(promise);
    count++;
  }

  function dataFinished(data_set) {
    if (final_result) {
      defer.resolve(data_set);
    }
    else {
      defer.reject(data_set);
    }
  }

  return promiseWhile(condition, worker).then(function() {
    Q.allSettled(promises).then(dataFinished).done();
    return defer.promise;
  });
};


// PromiseController::displayResult {{{1
PromiseController.prototype.displayResult = function displayResult(allFulfilled, data_set) {
  this.end_time = new Date().getTime();
  this.info_divs.live_update.hide();
  this.info_divs.summary
    .text("Done. " + data_set.length + " objects processed in " + this.calculateTime() + " ms.")
    .removeClass("fulfilled").removeClass("rejected")
    .addClass(allFulfilled ? "fulfilled" : "rejected")
    .show();
};


// PromiseController::setupInfoDisplay {{{1
PromiseController.prototype.setupInfoDisplay = function setupInfoDisplay() {
  this.info_divs.summary.hide();
  this.info_divs.live_update.show();
};


// PromiseController::resolveDataObject {{{1
PromiseController.prototype.resolveDataObject = function resolveDataObject(data) {
  this.tasks_complete++;
  this.displayCount();
  $(this.content_list_items[data.id])
    .removeClass("pending")
    .addClass(data.isABadWorker ? "rejected" : "fulfilled")
    .text(data.toString());
};


// PromiseController::displayCount {{{1
PromiseController.prototype.displayCount = function displayCount() {
  this.info_divs.count.text("" + this.tasks_complete + " (" + this.calculateTime() + " ms)");
};


// PromiseController::calculateTime {{{1
PromiseController.prototype.calculateTime = function calculateTime() {
  var current_time = this.end_time || new Date().getTime();
  return current_time - this.start_time;
};


// Helper functions {{{1
// promiseConfirmation {{{2
function promiseConfirmation(message) {
  return Q.delay(1).then(function() {
    if (confirm(message)) {
      return "User confirmed";
    }
    throw "User cancled";
  });
}
// }}}1

module.exports = PromiseController;
/* vim:set sw=2 ts=2 et fdm=marker: */
