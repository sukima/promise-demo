Q = require("q");

function DataObject(options) { /*jshint eqnull:true */
  if (options == null) {
    options = {};
  }
  this.id      = options.id;
  this.title   = options.title;
  this.timeout = options.timeout || 100;
}

exports.buildData = function (size) {
  var i, dataObject, storage = [];
  for (i = 0; i < size; i++) {
    dataObject = new DataObject({
      id:      i,
      timeout: randomTimeout(100, 5000),
      title:   "foobar"
    });
    storage.push(dataObject);
  }
  return storage;
};

function randomTimeout(min, max) {
  return (Math.floor((Math.random() * (max - min) + min) / 10) * 10);
}
