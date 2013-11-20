var $ = require("jquery");
var PromiseController = require("./promise_controller");

require("jquery-ui");

$(function() {
  var appController = new PromiseController();
  appController.init();
});
