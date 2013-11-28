// PromiseController - Control the building and displaying of data objects
var Q                      = require("q");
var $                      = require("jquery");
var DataGenerator          = require("./data_generator");
var ConfirmationController = require("./confirmation_controller");
var promiseWhile           = require("./promise_while");
var OverlayController      = require("./overlay_controller");

// PromiseController {{{1
function PromiseController() {
  this.controls = {
    reset_btn:     $("#reset"),
    run_button:    $("#run-btn"),
    allow_failues: $("#allow-failures"),
    data_size:     $("#data-size")
  };
  this.info_divs = {
    live_update: $("#run-info"),
    count:       $("#count"),
    summary:     $("#info")
  };
  this.content_list = $("#list");
  this.overlay = new OverlayController();
}

// PromiseController::init {{{1
PromiseController.prototype.init = function init() {
  this.controls.run_button.button()
    .click($.proxy(this, "start"));
  this.controls.reset_btn.button().hide()
    .click($.proxy(this, "reset"));
  return this;
};

// PromiseController::getAllowFailures {{{1
PromiseController.prototype.getAllowFailures = function getAllowFailures() {
  return this.controls.allow_failues.is(":checked");
};

// PromiseController::getDataSetSize {{{1
PromiseController.prototype.getDataSetSize = function getDataSetSize() {
  var value = parseInt(this.controls.data_size.val(), 10);
  return isNaN(value) ? 0 : value;
};

// PromiseController::start {{{1
PromiseController.prototype.start = function start() {
  var _this = this;
  this.disableControls();

  var waitForValidation = this.validateDataSize()
    .then($.proxy(this, "showLoading"));
  return waitForValidation.then(function() {
    _this.tasks_complete = 0;
    _this.start_time = new Date().getTime();
    _this.end_time = null;
    _this.setupInfoDisplay();

    var waitForDOM  = _this.buildDom()
      .then(function(items) {
        _this.content_list_items = items;
      });

    var waitForData = _this.generateData();

    var waitForSetup = Q.all([waitForDOM, waitForData]);
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
  this.controls.reset_btn.show().button("enable");
  this.controls.run_button.button("enable");
  this.controls.data_size.prop("disabled", false);
  this.controls.allow_failues.prop("disabled", false);
  return arguments[0];
};

// PromiseController::disableControls {{{1
PromiseController.prototype.disableControls= function disableControls() {
  this.controls.reset_btn.button("disable");
  this.controls.run_button.button("disable");
  this.controls.data_size.prop("disabled", true);
  this.controls.allow_failues.prop("disabled", true);
  return arguments[0];
};

// PromiseController::showLoading {{{1
PromiseController.prototype.showLoading = function showLoading() {
  return this.overlay.show();
};

// PromiseController::hideLoading {{{1
PromiseController.prototype.hideLoading = function hideLoading() {
  return this.overlay.hide();
};

// PromiseController::finish {{{1
PromiseController.prototype.finish = function finish() {
  this.hideLoading();
  this.enableControls();
};

// PromiseController::validateDataSize {{{1
PromiseController.prototype.validateDataSize = function validateDataSize() {
  var size = this.getDataSetSize();
  var confirmation = ConfirmationController.getInstance();
  var message;
  if (size >= 70000) {
    message = "Gulp! I really think that is too high. Blue smoke will probubly come out the back of your computer! <strong>Are you absolutly sure?</strong>";
  }
  else if (size >= 40000) {
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
  var size = this.getDataSetSize();

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
  return DataGenerator.buildData(this.getDataSetSize(), this.getAllowFailures());
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
  this.displayCount();
  this.info_divs.live_update.show();
};

// PromiseController::resolveDataObject {{{1
PromiseController.prototype.resolveDataObject = function resolveDataObject(data) {
  this.tasks_complete++;
  this.displayCount();
  $(this.content_list_items[data.id])
    .removeClass("pending")
    .addClass(data.isABadWorker ? "rejected" : "fulfilled")
    .addClass("box-shadow")
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

// PromiseController::reset {{{1
PromiseController.prototype.reset = function reset() {
  var _this = this;
  this.controls.reset_btn.hide();
  this.info_divs.live_update.hide();
  this.info_divs.summary.hide();
  this.content_list.empty();
  this.overlay.reset();
};
// }}}1

module.exports = PromiseController;
/* vim:set sw=2 ts=2 et fdm=marker: */
