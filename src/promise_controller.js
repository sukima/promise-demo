// PromiseController - Control the building and displaying of data objects
var Q                      = require("q");
var $                      = require("jquery");
var DataGenerator          = require("./data_generator");
var ConfirmationController = require("./confirmation_controller");
var promiseWhile           = require("./promise_while");

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
  this.controls.run_button.button()
    .click($.proxy(this, "start"));
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

// PromiseController::start {{{1
PromiseController.prototype.start = function start() {
  var _this = this;
  this.disableControls();

  var waitForValidation = this.validateDataSize();
  waitForValidation.then($.proxy(this, "showLoading"));
  return waitForValidation.then(function() {
    _this.tasks_complete = 0;
    _this.start_time = new Date().getTime();
    _this.end_time = null;

    var waitForDOM  = waitForValidation.delay(1).then($.proxy(_this, "buildDom"));
    waitForDOM.then(function(items) {
      _this.content_list_items = items;
    });

    var waitForData = waitForValidation.delay(1).then($.proxy(_this, "generateData"));

    var waitForSetup = Q.all([waitForDOM, waitForData]);
    waitForSetup.then($.proxy(_this, "setupInfoDisplay"));
    waitForSetup.then($.proxy(_this, "hideLoading"));

    var waitForExecution = waitForSetup
      .get(1).then($.proxy(_this, "execute"));

    return waitForExecution
      .then(
        $.proxy(_this, "displayResult", true),
        $.proxy(_this, "displayResult", false),
        $.proxy(_this, "resolveDataObject")
      )
      .fin($.proxy(_this, "finish"));
  }).fail($.proxy(this, "finish"));
};

// PromiseController::enableControls {{{1
PromiseController.prototype.enableControls = function enableControls() {
  this.controls.run_button.button("enable");
  this.controls.data_size.prop("disabled", false);
  this.controls.allow_failues.prop("disabled", false);
  return arguments[0];
};

// PromiseController::disableControls {{{1
PromiseController.prototype.disableControls= function disableControls() {
  this.controls.run_button.button("disable");
  this.controls.data_size.prop("disabled", true);
  this.controls.allow_failues.prop("disabled", true);
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
  var confirmation = ConfirmationController.getInstance();
  var message;
  if (size >= 90000) {
    message = "Gulp! I really think that is too high. Blue smoke will probubly come out the back of your computer! Are you absolutly sure?";
  }
  else if (size >= 50000) {
    message = "Whoa Nelly! That's a lot! The browser will probubly cry. Are you really sure you want to do this?";
  }
  else if (size >= 10000) {
    message = "That's getting a little heavy. Are you sure you want to bog your browser down?";
  }
  else {
    return Q("Data size ok");
  }
  return confirmation.open(message).promise();
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
    list_items += '<div class="list-item pending ui-corner-all">' + count + ': Pending...</div>';
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
// }}}1

module.exports = PromiseController;
/* vim:set sw=2 ts=2 et fdm=marker: */
