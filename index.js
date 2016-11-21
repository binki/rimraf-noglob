'use strict';

var rimrafGlob = require('rimraf')

function fixOpts(opts) {
  return Object.assign({
    glob: false,
  }, opts)
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
