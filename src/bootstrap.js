var $ = require("jquery");
var jq_alert = require("./confirmation_controller").alert;
var PromiseController = require("./promise_controller");
require("jquery_ui");

var version = "0.0.1";

function showAbout() {
  jq_alert("Promise-Demo project, version " + exports.version, "About");
}

$(function init() {
  var appController = new PromiseController();
  appController.init();
  $("#logo").click(exports.showAbout);
});
