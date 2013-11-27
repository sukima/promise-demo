var $ = require("jquery");
var jq_alert = require("./confirmation_controller").alert;
var PromiseController = require("./promise_controller");
require("jquery_ui");

function showAbout() {
  var pkg = require("../package.json");
  var message = "Promise-Demo<br>Version " + pkg.version;
  if (pkg.author) {
    message += "<br>By " + pkg.author.replace(/\s*[\(<].*$/, "");
  }
  if (pkg.contributors) {
    pkg.contributors.forEach(function(contributor) {
      message += ", " + contributor.name;
    });
  }
  jq_alert(message);
}

$(function init() {
  var appController = new PromiseController();
  appController.init();
  $("#logo").click(showAbout);
  $("a.button").button();
});
