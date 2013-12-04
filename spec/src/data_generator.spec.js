describe("DataGenerator", function() {
  var DataGenerator = require("../../src/data_generator");

  describe("DataObject", function() {

    beforeEach(function() {
      this.test_obj = new DataGenerator({id: 0, title: "foobar"});
    });

    describe("#constructor", function() {

      it("should set a created_on timestamp", function() {
        expect( this.test_obj.created_on ).toBeDefined();
      });

      it("should throw an exception if arguments are missing", function() {
        expect(function() { new DataGenerator({}); }).toThrow();
        expect(function() { new DataGenerator({ id: 1 }); }).toThrow();
        expect(function() { new DataGenerator({ title: "bar" }); }).toThrow();
      });

    });

    describe("#getRunningTime", function() {

      it("should return -1 when object has not completed yet", function() {
        expect( this.test_obj.getRunningTime() ).toBe(-1);
      });

      it("should return a number", function() {
        this.test_obj.completed_on = new Date().getTime() + 1000;
        expect( this.test_obj.getRunningTime() ).toEqual(jasmine.any(Number));
      });

    });

    describe("#start", function() {

      beforeEach(function() {
        this.test_obj.timeout = 1;
      });

      it("should return a promise", function() {
        expect( this.test_obj.start() ).toBeAPromise();
      });

      it("should assign a completed_on when resolved", function() {
        var _this = this;
        runs(function() {
          return this.test_obj.start().then(
            function() {
              expect( _this.test_obj.completed_on ).toEqual(jasmine.any(Number));
            },
            jasmine.expectFulfilled
          );
        });
      });

      it("should provide itself as the value to the fulfilled promise", function() {
        var _this = this;
        runs(function() {
          return this.test_obj.start().then(
            function(value) {
              expect( value ).toBe(_this.test_obj);
            },
            jasmine.expectFulfilled
          );
        });
      });

      it("should provide itself as the value to the rejected promise", function() {
        this.test_obj.isABadWorker = true;
        var _this = this;
        runs(function() {
          return this.test_obj.start().then(
            jasmine.expectRejected,
            function(reason) {
              expect( reason ).toBe(_this.test_obj);
            }
          );
        });
      });

    });

    describe("#toString", function() {

      it("should return a string", function() {
        expect( this.test_obj.toString() ).toEqual(jasmine.any(String));
      });

    });

  });

  describe("#buildData (static)", function() {

    it("should return a promise", function() {
      expect( DataGenerator.buildData(1) ).toBeAPromise();
    });

    it("should create an array of data objects", function() {
      runs(function() {
        return DataGenerator.buildData(3).then(
          function(value) {
            expect( value ).toEqual([
              jasmine.any(DataGenerator),
              jasmine.any(DataGenerator),
              jasmine.any(DataGenerator)
            ]);
          },
          jasmine.expectFulfilled
        );
      });
    });

  });

});
/* vim:set sw=2 ts=2 et fdm=marker: */
