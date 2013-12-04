describe("RaceController", function() {
  var RaceController = require("../../src/race_controller");

  beforeEach(function() {
    this.rc = new RaceController();
  });

  describe("#constructor", function() {
  });

  describe("#init", function() {

    it("should be chainable", function() {
      expect( this.rc.init() ).toBe(this.rc);
    });

  });

  describe("#start", function() {
  });

  describe("#enableControls", function() {

    it("should disable the buttons", function() {
      spyOn($.fn, "button");
      this.rc.enableControls();
      expect( $.fn.button ).toHaveBeenCalledWith("enable");
    });

  });

  describe("#disableControls", function() {

    it("should disable the buttons", function() {
      spyOn($.fn, "button");
      this.rc.disableControls();
      expect( $.fn.button ).toHaveBeenCalledWith("disable");
    });

  });

  describe("#readyHorses", function() {
  });

  describe("#setHorses", function() {
  });

  describe("#goHorses", function() {
  });

  describe("#trotHorses", function() {
  });

  describe("#finishRace", function() {
  });

  describe("#reset", function() {
  });
});
