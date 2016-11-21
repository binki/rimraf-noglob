'use strict';

var rimrafGlob = require('rimraf')

function fixOpts(opts) {
  // Support node-0:
  var result = {
    glob: false,
  }
  for (var i in opts) {
    result[i] = opts[i]
  }
  return result
}

module.exports = function (f, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }
  return rimrafGlob(f, fixOpts(opts), callback)
}

module.exports.sync = function (f, opts) {
  return rimrafGlob.sync(f, fixOpts(opts))
}
