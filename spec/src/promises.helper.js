jasmine.expectFulfilled = function (reason) {
	expect( "Promise to be fulfilled but it was rejected instead: " + reason ).toBeNull();
};

jasmine.expectRejected = function (value) {
	expect( "Promise to be rejected but it was fulfilled instead: " + value ).toBeNull();
};
