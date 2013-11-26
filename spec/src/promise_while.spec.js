describe("promiseWhile()", function() {
  var promiseWhile = require("../../src/promise_while");
  var Q = require("q");
  Q.longStackSupport = true;

  beforeEach(function() {
    this.workerSpy = jasmine.createSpy("worker");
    this.conditionSpy = jasmine.createSpy("condition");
  });

  it("should execute work when condition is false", function() {
    var condition_response = true;
    this.conditionSpy.andCallFake(function condition() {
      var response = condition_response;
      condition_response = false;
      return response;
    });
    runs(function() {
      var _this = this;
      return promiseWhile(this.conditionSpy, this.workerSpy)
        .then(function() {
          expect( _this.workerSpy ).toHaveBeenCalled();
        }, jasmine.expectFulfilled);
    });
  });

  it("should resolve promise when condition becomes false", function() {
    this.conditionSpy.andReturn(false);
    runs(function() {
      return promiseWhile(this.conditionSpy, this.workerSpy)
        .then(function() {
          expect( true ).toBeTruthy();
        }, jasmine.expectFulfilled);
    });
  });

  it("should reject promise when worker throws an exception", function() {
    this.conditionSpy.andReturn(true);
    this.workerSpy.andThrow("rejection");
    runs(function() {
      return promiseWhile(this.conditionSpy, this.workerSpy)
        .then(jasmine.expectRejected, function(reason) {
          expect( reason ).toBe("rejection");
        });
    });
  });

});
/* vim:set sw=2 ts=2 et fdm=marker: */
