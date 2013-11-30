// OverlayController - Manages the loading overlay and intro sections
var Q = require("q");
var $ = require("jquery");

// OverlayController::constructor {{{1
function OverlayController(timeouts) {
  /*jshint eqnull:true */
  this.timeouts = timeouts || {};
  if (this.timeouts.intro_fade == null) { this.timeouts.intro_fade = 1000; }
  if (this.timeouts.overlay_fade == null) { this.timeouts.overlay_fade = 100; }
  if (this.timeouts.min_delay == null) { this.timeouts.min_delay = 500; }
  this.intro = $("#intro");
  this.loading_overlay = $("#loading");
}

// OverlayController::show {{{1
OverlayController.prototype.show = function show() {
  var waitForHide = Q.defer(), _this = this;
  this.intro.hide("fade", this.timeouts.intro_fade, waitForHide.resolve);
  return waitForHide.promise.then(function() {
    // Add an artificial delay so the user can see the loading screen. Some
    // browsers might run faster then the user interface can catch up.
    var waitForMinDelay = Q.delay(_this.timeouts.min_delay);
    var waitForShow = Q.defer();
    _this.loading_overlay.show("fade", _this.timeouts.overlay_fade, waitForShow.resolve);
    return Q.all([waitForShow.promise, waitForMinDelay]);
  });
};

// OverlayController::hide {{{1
OverlayController.prototype.hide = function hide() {
  var waitForHide = Q.defer();
  this.loading_overlay.hide("fade", this.timeouts.overlay_fade, waitForHide.resolve);
  return waitForHide.promise;
};

// OverlayController::reset {{{1
OverlayController.prototype.reset = function reset() {
  var _this = this;
  return this.hide().then(function() {
    var waitForShow = Q.defer();
    _this.intro.show("blind", _this.timeouts.intro_fade, waitForShow.resolve);
    return waitForShow.promise;
  });
};
// }}}1

module.exports = OverlayController;
/* vim:set ts=2 sw=2 et fdm=marker: */
