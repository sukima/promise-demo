var $ = require("jquery");
var jq_alert = require("./confirmation_controller").alert;
var PromiseController = require("./promise_controller");
require("jquery-ui");

var version = "0.0.1";

$(function() {
  var appController = new PromiseController();
  appController.init();
  $("#logo").click(showAbout);
});

function showAbout() {
  jq_alert("Promise-Demo project, version " + version, "About");
}
