// ConfirmationController - Controls a confirmation popup
var Q = require("q");
var singleton_instance;

// ConfirmationController {{{1
function ConfirmationController(element) {
  this.defer = null;
  this.dialog_element = $(element);
  this.dialog_element.dialog({
    modal:     true,
    autoOpen:  false,
    close:     $.proxy(this, "resolve"),
    buttons: {
      cancel: {
        text:     "Cancel",
        "class":  "ui-priority-primary",
        priority: "primary",
        click:    $.proxy(this, "onButtonClick", "cancel"),
      },
      go: {
        text:     "Yes, do it!",
        "class":  "ui-priority-secondary",
        priority: "secondary",
        click:    $.proxy(this, "onButtonClick", "go")
      }
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
  this.dialog_element.html(message || "");
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
    singleton_instance = new ConfirmationController("#notice");
  }
  return singleton_instance;
};

// ConfirmationController.alert {{{1
// A one-off jQuery-UI replacement for JS alert()
ConfirmationController.alert = function alert(message, title) {
  var defer = Q.defer();

  if (!message) {
    message = "ConfirmationController.alert called without a message";
  }

  $("<div/>").clone().html(message).dialog({
    title:     title || "Alert",
    resizable: false,
    modal:     true,
    close:     defer.resolve,
    buttons: {
      "Ok": function() { $(this).dialog("close"); }
    }
  });

  return defer.promise;
};
// }}}1

module.exports = ConfirmationController;
/* vim:set ts=2 sw=2 et fdm=marker: */
