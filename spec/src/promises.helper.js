jasmine.expectFulfilled = function (reason) {
	expect( "Promise to be fulfilled but it was rejected instead: " + reason ).toBeNull();
};

jasmine.expectRejected = function (value) {
	expect( "Promise to be rejected but it was fulfilled instead: " + value ).toBeNull();
};

function toBeAPromise() {
  var notMsg = this.isNot ? " not" : "";
  this.message = function() { return "Expected " + jasmine.pp(this.actual) + " to" + notMsg + " be a promise."; };

  return (this.actual && typeof this.actual.then === "function");
}

beforeEach(function() {
  this.addMatchers({
    toBeAPromise: toBeAPromise
  });
});
