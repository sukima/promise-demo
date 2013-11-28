var $ = require("jquery");
require("jquery_ui");

// showAbout {{{1
exports.showAbout = function showAbout() {
  var pkg = require("../package.json");
  var message = "Promise-Demo<br>Version " + pkg.version;
  var jq_alert = require("./confirmation_controller").alert;


  if (pkg.author) {
    message += "<br>By " + pkg.author.replace(/\s*[\(<].*$/, "");
  }

  if (pkg.contributors) {
    pkg.contributors.forEach(function(contributor) {
      message += ", " + contributor.name;
    });
  }

  return jq_alert(message);
};

// init {{{1
exports.init = function init(controller) {
  return $(function() {
    var AppController;

    switch (controller) {
      // case "RaceController":
      //   AppController = require("./race_controller");
      //   break;
      default:
        AppController = require("./promise_controller");
    }

    (new AppController()).init();

    $("#logo").click(exports.showAbout);
    $("a.button").button();
  });
};
// }}}1

window.APP = module.exports;
/* vim:set ts=2 sw=2 et fdm=marker: */
