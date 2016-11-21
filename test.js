'use strict';

var assert = require('assert')
var child_process = require('child_process')
var fs = require('fs')
var path = require('path')
var rimraf = require('./index.js')

process.chdir(__dirname)

describe('rimraf-noglob', function () {
  var tmpdir = 'tmp'

  var clean = function () {
    rimraf.sync(tmpdir)
  }

  beforeEach(function () {
    // Ensure a clean starting point
    clean()

    fs.mkdirSync(tmpdir)
  })

  after(clean)

  it('should remove a given path', function (done) {
    var file = path.join(tmpdir, 'file')
    fs.writeFileSync(file, 'hi')

    assert(fs.existsSync(file))
    rimraf(file, function (err) {
      assert.ifError(err)
      assert(!fs.existsSync(file))
      assert(fs.existsSync(tmpdir))
      done()
    })
  })

  it('should pass options', function (done) {
    var file = path.join(tmpdir, 'file')
    fs.writeFileSync(file, 'hi')

    var customUnlinkCalled = false;

    assert(fs.existsSync(file))
    rimraf(file, {
      unlink: function (path, cb) {
        customUnlinkCalled = true

        fs.unlink(path, cb)
      },
    }, function (err) {
      assert.ifError(err)
      assert(!fs.existsSync(file))
      assert(fs.existsSync(tmpdir))
      done()
    });
  })

  describe('handling globs', function () {
    var file = path.join(tmpdir, 'file')
    var nonexistentWildFile = path.join(tmpdir, 'f*')

    // http://stackoverflow.com/a/39286581/429091
    beforeEach(function () {
      fs.writeFileSync(file, 'hi')

      assert(fs.existsSync(file))
      assert(!fs.existsSync(nonexistentWildFile))
    })

    it('should ignore globs', function (done) {
      rimraf(nonexistentWildFile, function (err) {
        assert.ifError(err)
        assert(fs.existsSync(file))
        assert(!fs.existsSync(nonexistentWildFile))
        done()
      })
    })

    it ('should allow globs if requested by options', function (done) {
      rimraf(nonexistentWildFile, {
        glob: {},
      }, function (err) {
        assert.ifError(err)
        assert(!fs.existsSync(file))
        assert(!fs.existsSync(nonexistentWildFile))
        done()
      })
    })
  })

  describe('cli', function () {
    function runCli(args) {
      return child_process.spawnSync(process.execPath, [
        'bin/rimraf-noglob',
      ].concat(args ? args : []), {
        stdio: 'inherit',
      })
    }

    it('should remove files', function () {
      var files = [ 'a', 'b', 'c', ].map(function (file) {
        return path.join(tmpdir, file);
      })
      files.forEach(function (file) {
        fs.writeFileSync(file, 'hi')
        assert(fs.existsSync(file))
      })

      var result = runCli(files)
      assert(0 === result.status)
      files.forEach(function (file) {
        assert(!fs.existsSync(file))
      })
    })

    it('should ignore globs', function () {
      var files = [ 'a', 'b', 'c', ].map(function (file) {
        return path.join(tmpdir, file);
      })
      files.forEach(function (file) {
        fs.writeFileSync(file, 'hi')
        assert(fs.existsSync(file))
      })

      var nonexistentFiles = [ 'a*', '?', ].map(function (file) {
        assert(!fs.existsSync(file))
        return path.join(tmpdir, file)
      })

      var result = runCli(nonexistentFiles)
      assert(0 === result.status)
      files.forEach(function (file) {
        assert(fs.existsSync(file), file)
      })
    })
  })
})
