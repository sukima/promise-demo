describe("ConfirmationController", function() {
  var ConfirmationController = require("../../src/confirmation_controller");

  beforeEach(function() {
    this.dialogSpy = spyOn($.prototype, "dialog");
    loadFixtures("confirmation_controller.html");
    this.cc = new ConfirmationController("#notice");
  });

  describe("#constructor", function() {

    it("should initialize a dialog", function() {
      expect( this.dialogSpy ).toHaveBeenCalledWith(
        jasmine.objectContaining({ autoOpen: false })
      );
    });

  });

  describe("#promise", function() {

    it("should return a promise", function() {
      expect( this.cc.promise() ).toBeAPromise();
    });

    it("should reject the promise if dialog is closed", function() {
      runs(function() {
        return this.cc.promise().then(
          jasmine.expectRejected,
          function(reason) {
            expect( true ).toBeTruthy();
          }
        );
      });
    });

  });

  describe("#open", function() {

    beforeEach(function() {
      this.result = this.cc.open("foobar");
    });

    it("should open the dialog", function() {
      expect( this.dialogSpy ).toHaveBeenCalledWith("open");
    });

    it("should set the dialog message", function() {
      expect( $("#notice") ).toHaveText("foobar");
    });

    it("should be chainable", function() {
      expect( this.result ).toBe(this.cc);
    });

  });

  describe("#close", function() {

    beforeEach(function() {
      this.result = this.cc.close();
    });

    it("should close the dialog", function() {
      expect( this.dialogSpy ).toHaveBeenCalledWith("close");
    });

    it("should be chainable", function() {
      expect( this.result ).toBe(this.cc);
    });

  });

  describe("#onButtonClick", function() {

    it("should close the dialog", function() {
      this.cc.onButtonClick();
      expect( this.dialogSpy ).toHaveBeenCalledWith("close");
    });

  });

  describe("on close callback (#resolve)", function() {

    beforeEach(function() {
      this.closeCallback = this.dialogSpy.calls[0].args[0].close;
      expect( this.closeCallback ).toBeDefined();
      this.promise = this.cc.open().promise();
    });

    it("should resolve the promise when dialog is confirmed", function() {
      this.cc.confirmation = true;
      runs(function() {
        this.closeCallback();
        return this.promise.then(
          function() { expect( true ).toBeTruthy(); },
          jasmine.expectFulfilled
        );
      });
    });

    it("should reject the promise when dialog is canceled", function() {
      this.cc.confirmation = false;
      runs(function() {
        this.closeCallback();
        return this.promise.then(
          jasmine.expectRejected,
          function() { expect( true ).toBeTruthy(); }
        );
      });
    });

  });

  describe("#getInstance (static)", function() {
    var instance_object = ConfirmationController.getInstance();

    it("should return an instance of ConfirmationController", function() {
      expect( instance_object ).toEqual(jasmine.any(ConfirmationController));
    });

    it("should return the same instance each time (singleton)", function() {
      var result = ConfirmationController.getInstance();
      expect( result ).toBe(instance_object);
    });

  });

  describe("#alert (static)", function() {

    it("should open a modal dialog", function() {
      ConfirmationController.alert("foobar");
      expect( this.dialogSpy ).toHaveBeenCalledWith(
        jasmine.objectContaining({ modal: true })
      );
    });

    it("should return a promise", function() {
      expect( ConfirmationController.alert() ).toBeAPromise();
    });

    it("should resolve the promise when dialog is closed", function() {
      runs(function() {
        var promise = ConfirmationController.alert();
        this.dialogSpy.mostRecentCall.args[0].close();
        return promise.fail(jasmine.expectFulfilled);
      });
    });

  });

});
