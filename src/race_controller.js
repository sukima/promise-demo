// RaceController - A controller for the horse race demo
var Q                 = require("q");
var $                 = require("jquery");
var OverlayController = require("./overlay_controller");

// RaceController::constructor {{{1
function RaceController() {
  this.reset_btn = $("#reset-btn");
  this.run_btn   = $("#run_btn");
  this.overlay   = new OverlayController();
}

// RaceController::init {{{1
RaceController.prototype.init = function init() {
  this.reset_btn.button();
  this.run_btn.button();
  return this;
};

// RaceController::start {{{1
RaceController.prototype.start = function start() {
};

// RaceController::enableControls {{{1
RaceController.prototype.enableControls = function enableControls() {
  this.reset_btn.button("enable");
  this.run_btn.button("enable");
};

// RaceController::disableControls {{{1
RaceController.prototype.disableControls = function disableControls() {
  this.reset_btn.button("disable");
  this.run_btn.button("disable");
};

// RaceController::readyHorses {{{1
RaceController.prototype.readyHorses = function readyHorses() {
};

// RaceController::setHorses {{{1
RaceController.prototype.setHorses = function setHorses() {
};

// RaceController::goHorses {{{1
RaceController.prototype.goHorses = function goHorses() {
};

// RaceController::trotHorses {{{1
RaceController.prototype.trotHorses = function trotHorses() {
};

// RaceController::finishRace {{{1
RaceController.prototype.finishRace = function finishRace() {
};

// RaceController::reset {{{1
RaceController.prototype.reset = function reset() {
};
// }}}1

module.exports = RaceController;
/* vim:set ts=2 sw=2 et fdm=marker: */
