describe("OverlayController", function() {
  var OverlayController = require("../../src/overlay_controller");

  beforeEach(function() {
    loadFixtures("overlay_controller.html");
    this.oc = new OverlayController({
      intro_fade:   10,
      overlay_fade: 20,
      min_delay:    30
    });
  });

  describe("#show", function() {

    it("should return a promise", function() {
      expect( this.oc.show() ).toBeAPromise();
    });

    it("should hide intro and show overlay", function() {
      runs(function() {
        return this.oc.show().then(
          function() {
            expect( $("#intro") ).not.toBeVisible();
            expect( $("#loading") ).toBeVisible();
          },
          jasmine.expectFulfilled
        );
      });
    });

  });

  describe("#hide", function() {

    it("should return a promise", function() {
      expect( this.oc.hide() ).toBeAPromise();
    });

    it("should hide overlay", function() {
      $("#intro").hide();
      $("#loading").show();
      runs(function() {
        return this.oc.hide().then(
          function() {
            expect( $("#intro") ).not.toBeVisible();
            expect( $("#loading") ).not.toBeVisible();
          },
          jasmine.expectFulfilled
        );
      });
    });

  });

  describe("#reset", function() {

    it("should return a promise", function() {
      expect( this.oc.reset() ).toBeAPromise();
    });

    it("should show intro", function() {
      $("#intro").hide();
      $("#loading").hide();
      runs(function() {
        return this.oc.reset().then(
          function() {
            expect( $("#intro") ).toBeVisible();
            expect( $("#loading") ).not.toBeVisible();
          },
          jasmine.expectFulfilled
        );
      });
    });

    it("should hide overlay when it is still active", function() {
      $("#intro").hide();
      $("#loading").show();
      runs(function() {
        return this.oc.reset().then(
          function() {
            expect( $("#intro") ).toBeVisible();
            expect( $("#loading") ).not.toBeVisible();
          },
          jasmine.expectFulfilled
        );
      });
    });

  });
});
