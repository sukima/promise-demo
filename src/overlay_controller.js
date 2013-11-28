// OverlayController - Manages the loading overlay and intro sections
var Q = require("q");
var $ = require("jquery");

// OverlayController::constructor {{{1
function OverlayController() {
  this.intro = $("#intro");
  this.loading_overlay = $("#loading");
}

// OverlayController::show {{{1
OverlayController.prototype.show = function show() {
  var waitForHide = Q.defer(), _this = this;
  this.intro.hide("fade", 1000, waitForHide.resolve);
  return waitForHide.promise.then(function() {
    var waitForShow = Q.defer();
    _this.loading_overlay.show("fade", 100, waitForShow.resolve);
    // Add an artificial delay so the user can see the loading screen. Some
    // browsers might run faster then the user interface can catch up.
    return waitForShow.promise.delay(500);
  });
};

// OverlayController::hide {{{1
OverlayController.prototype.hide = function hide() {
  var waitForHide = Q.defer(), _this = this;
  this.loading_overlay.hide("fade", 100, waitForHide.resolve);
  return waitForHide.promise;
};

// OverlayController::reset {{{1
OverlayController.prototype.reset = function reset() {
  var _this = this;
  return this.hide().then(function() {
    var waitForShow = Q.defer();
    _this.intro.show("blind", 1000, waitForShow.resolve);
    return waitForShow.promise;
  });
};
// }}}1

module.exports = OverlayController;
/* vim:set ts=2 sw=2 et fdm=marker: */
