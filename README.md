Which is easier?

Vanilla `rimraf`:

    var rimraf = require('rimraf');
    
    rimraf(untrustedPath, { glob: false, });
    rimraf('/path/to/file?', { glob: false, });
    // Passing a trusted string and relying on cwd.
    rimraf('tmp/*.o');

A wrapper, `rimraf-noglob`:

    var rimraf = require('rimraf-noglob');
    
    rimraf(untrustedPath);
    rimraf('/path/to/file?');
    // Passing a trusted string and relying on cwd, explicitly turn on globbing.
    rimraf('tmp/*.o', { glob: {}, });

# Usage

## `rimraf(f, [opts], callback)`

Same as [`rimraf()`](https://github.com/isaacs/rimraf#api) except that
`opts.glob` defaults to `false`.

## `rimraf.sync(f, [opts])`

Same as [`rimraf.sync()`](https://github.com/isaacs/rimraf#rimrafsync)
except that `opts.glob` defaults to `false`.

# CLI

It probably never makes sense to invoke this from the command
line. But it will be available as `rimraf <path> [<path> …]`. Note
that your shell may perform glob expansion for you unless if you are
using Windows, in which case [the libc of the `exec()`d node process
will perform shell expansion based on
`CommandLine`.](http://stackoverflow.com/a/4094897/429091). If you
want to be safe, either be certain that you’re using an Operating
System that has POSIX-style processes or invoke the function via
JavaScript directly.

# Version

For simplicity, this package’s MAJOR.MINOR will reflect the
MAJOR.MINOR of the version of `rimraf` it depends on and is tested
against. Please open an issue if a new version is missing or a
backport is necessary.
