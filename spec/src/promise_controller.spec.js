describe("PromiseController", function() {
  var PromiseController = require("../../src/promise_controller");

  beforeEach(function() {
    loadFixtures("promise_controller.html");
    this.pc = new PromiseController();
  });

  describe("#init", function() {

    it("should be chainable", function() {
      expect( this.pc.init() ).toBe(this.pc);
    });

  });

  describe("#getAllowFailures", function() {

    it("should return false when checkbox is unchecked", function() {
      expect( this.pc.getAllowFailures() ).toBeFalsy();
    });

    it("should return true when checkbox is checked", function() {
      $("#allow-failures").prop("checked", true);
      expect( this.pc.getAllowFailures() ).toBeTruthy();
    });

  });

  describe("#getDataSetSize", function() {

    beforeEach(function() {
      this.input = $("#data-size");
    });

    it("should return the value from the input field", function() {
      this.input.val(0);
      expect( this.pc.getDataSetSize() ).toBe(0);
      this.input.val(12);
      expect( this.pc.getDataSetSize() ).toBe(12);
      this.input.val(123);
      expect( this.pc.getDataSetSize() ).toBe(123);
    });

    it("should return 0 with invalid input", function() {
      this.input.val("foo");
      expect( this.pc.getDataSetSize() ).toBe(0);
    });

  });

  describe("When the run button is pressed", function() {

    it("should run start()", function() {
      spyOn(this.pc, "start");
      expect( this.pc.start ).not.toHaveBeenCalled();
      $("#run-btn").trigger("click");
      expect( this.pc.start ).toHaveBeenCalled();
    });

  });

});
/* vim:set ts=2 sw=2 et: */
