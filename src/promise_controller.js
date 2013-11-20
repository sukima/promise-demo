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
