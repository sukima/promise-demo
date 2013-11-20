// ConfirmationController - Controls a confirmation popup
var Q = require("q");
var singleton_instance;

// ConfirmationController {{{1
function ConfirmationController() {
  this.defer = null;
  this.dialog_element = $("#notice");
  this.dialog_element.dialog({
    height:    140,
    modal:     true,
    resizable: false,
    autoOpen:  false,
    close:     $.proxy(this, "resolve"),
    buttons: {
      "Cancel":      $.proxy(this, "onButtonClick", "cancel"),
      "Yes, Do It!": $.proxy(this, "onButtonClick", "go")
    }
  });
}

// ConfirmationController::onButtonClick {{{1
ConfirmationController.prototype.onButtonClick = function onButtonClick(action) {
  if (action === "go") {
    this.confirmation = true;
  }
  this.dialog_element.dialog("close");
};

// ConfirmationController::resolve {{{1
ConfirmationController.prototype.resolve = function resolve() {
  if (this.confirmation) {
    this.defer.resolve("Confirmed");
  }
  else {
    this.defer.reject("Canceled");
  }
  this.defer = null;
};

// ConfirmationController::open {{{1
ConfirmationController.prototype.open = function open(message) {
  this.confirmation = false;
  this.defer = this.defer || Q.defer();
  this.dialog_element.text(message || "");
  this.dialog_element.dialog("open");
  return this;
};

// ConfirmationController::close {{{1
ConfirmationController.prototype.close = function close() {
  this.dialog_element.dialog("close");
  return this;
};

// ConfirmationController::promise {{{1
ConfirmationController.prototype.promise = function promise() {
  if (this.defer) {
    return this.defer.promise;
  }
  return Q.reject("Closed");
};

// ConfirmationController.getInstance {{{1
ConfirmationController.getInstance = function getInstance() {
  /*jshint eqnull:true */
  if (singleton_instance == null) {
    singleton_instance = new ConfirmationController();
  }
  return singleton_instance;
};
// }}}1

module.exports = ConfirmationController;
/* vim:set ts=2 sw=2 et fdm=marker: */
