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

This command will be available as `rimraf-noglob <path> [<path>
…]`. It will handle parameter expansion similarly to your favorite
CLI utility. Note that your shell may perform glob expansion for you
unless if you are using Windows, in which case [the libc of the
`exec()`d node process will perform shell expansion based on
`CommandLine`](http://stackoverflow.com/a/4094897/429091). If you
want to be safe, either be certain that you’re using an Operating
System that has POSIX-style processes or invoke the function via
JavaScript directly.

In my opinion, `rimraf-noglob` has less surprising behavior than
`rimraf`:

    $ touch test\* test1 test2
    $ rimraf test\*
    $ ls | grep -e test
    test1
    test2
    $ rimraf test\*
    $ ls | grep -e test
    $

What? It removed the exact match the first time but did glob expansion
the second time?

    $ touch test\* test1 test2
    $ rimraf-noglob test\*
    $ ls | grep -e test
    test1
    test2
    $ rimraf-noglob test\*
    $ ls | grep -e test
    test1
    test2
    $

`rimraf-noglob`, especially in a POSIX shell, unconditionally exhibits
the behavior expected of CLI programs. It lets the shell (or, on
Windows, libc) handle globbing for normal arguments.

# Version

For simplicity, this package’s MAJOR.MINOR will reflect the
MAJOR.MINOR of the version of `rimraf` it depends on and is tested
against. However, if changes to this project’s API are necessary,
exceptions may have to be made in the future. Those will be documented
here if that is ever the case.

Please open an issue if a new version of `rimraf` is missing or a
backport is necessary.
