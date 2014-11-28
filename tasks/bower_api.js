/*
 * grunt-bower-api
 * https://github.com/FKobus/grunt-bower-api
 *
 * Copyright (c) 2014 Ferry Kobus
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var bower,
    fs,
    glob,
    path,
    async,
    util,
    Emitter,
    wrench;

  function requireDeps() {
    bower = require('bower');
    fs = require('fs');
    glob = require('glob');
    wrench = require('wrench');
    path = require('path');
    async = require('async');
    util = require('util');
    Emitter = require('events').EventEmitter;
  }

  function fail(error) {
    grunt.fail.fatal(error);
  }

  function install(options, callback) {
    bower
      .commands
      .install([], options)
      .on('log', function(result) {
        grunt.log.writeln(['bower', result.id.cyan, result.message].join(' '));
      })
      .on('error', fail)
      .on('end', callback);
  }

  function copy(options, callback) {
    var files = [],
      results = bower
        .commands
        .list({paths: true});
    util.inherits(results, Emitter);
    results.on('end', function(results) {
      if (typeof results === 'object') {
        var packages = Object.keys(results);
        for (var index in results) {
          var file = results[index];
          if (typeof file === 'object') {
            var rawFileLength = file.length;
            for (var rawFileCount=0; rawFileCount<rawFileLength; rawFileCount++) {
              files = files.concat(files, _getFiles(file[rawFileCount])).unique();
            }
          } else {
            files = files.concat(files, _getFiles(file)).unique();
          }
        }
        if (files.length > 0) {
          var assetsDirectory = path.resolve(options.assetsDirectory),
            bowerDirectory = path.resolve(bower.config.directory),
            patterns = [],
            paths = [];

          if (!options.preservePaths && typeof options.copyTo !== 'undefined') {
            patterns = Object.keys(options.copyTo);
            paths = Object.keys(options.copyTo).map(function (key) {
              return path.resolve(options.copyTo[key]);
            });
          }

          var parsedFileLength = files.length;

          for (var parsedFileCount=0;parsedFileCount<parsedFileLength;parsedFileCount++) {
            var endFile = files[parsedFileCount],
              parts = endFile.split('/'),
              filename = parts.pop(),
              preserve = true,
              source = bowerDirectory + '/' + endFile,
              destination = assetsDirectory,
              extension = filename.split('.').pop();
            
            if (patterns.length > 0) {
              var pos;
              if (~(pos = patterns.indexOf('.' + extension))) {
                destination = paths[pos];
                preserve = false;
              }
            }
            // chop package name
            if (!options.preservePaths && preserve) {
              parts.shift();
            }

            if (preserve) {
              destination += '/' + parts.join('/') + '/';
            } else {
              destination += '/';
            }
            wrench.mkdirSyncRecursive(destination, '0755');
            destination += filename;
            if (fs.existsSync(destination)) {
              fs.unlinkSync(destination);
            }
            fs.createReadStream(source).pipe(fs.createWriteStream(destination));
            grunt.log.writeln(['copied', filename.cyan, options.assetsDirectory].join(' '));
          }
          callback();
        } else {
          callback();
        }
      } else {
        callback();
      }
    });
    results.on('error', fail);
  }

  function _getFiles(file) {
    file = _stripBowerDirectory(file);
    if (file.match(/([*])$/gm)) {
      file = glob.sync(file, {
        cwd: path.resolve(bower.config.directory)
      });
    }
    return file;
  }

  function _sanitizeFile(file) {
    while (file.charAt(0) === '.' || file.charAt(0) === '/') {
      file = file.substr(1);
    }
    return file;
  }

  function _stripBowerDirectory(file) {
    file = _sanitizeFile(file);
    var bowerDirectory = _sanitizeFile(bower.config.directory),
      bowerInFile = file.substr(0, bowerDirectory.length);
    if (bowerInFile === bowerDirectory) {
      file = file.substr(bowerDirectory.length);
    }
    return _sanitizeFile(file);
  }

  function clear(directory, callback) {
    var folders = fs.readdirSync(directory),
      l = folders.length;
    if (l > 0) {
      for (var i=0; i<l; i++) {
        var file = directory + '/' + folders[i];
        if (fs.statSync(file).isDirectory()) {
          wrench.rmdirSyncRecursive(file, true);
        } else {
          fs.unlinkSync(file);
        }
      }
    }
    callback();
  }

  grunt.registerMultiTask('bower_api', 'Grunt task for maintaining bower', function() {
    var tasks = [],
      done = this.async(),
      options = this.options({
        clearAssets: false,
        clearBower: false,
        assetsDirectory: './assets',
        install: true,
        copy: true,
        bowerOptions: {},
        preservePaths: false,
        copyTo: {
          '*.js': './assets/js',
          '*.css': './assets/css'
        }
      }),
      assetsDirectory,
      bowerDirectory,
      add = function(message, fn) {
        tasks.push(function(callback) {
          fn(function() {
            grunt.log.ok(message);
            callback();
          });
        });
      };

    // require dependencies
    requireDeps();

    assetsDirectory = path.resolve(options.assetsDirectory);
    if (!fs.existsSync(assetsDirectory)) {
      wrench.mkdirSyncRecursive(assetsDirectory, '0755');
    }
    bowerDirectory = path.resolve(bower.config.directory);
    if (!fs.existsSync(bowerDirectory)) {
      wrench.mkdirSyncRecursive(bowerDirectory, '0755');
    }
    
    if (options.clearAssets) {
      add('Clear assets folder', function(callback) {
        clear(assetsDirectory, callback);
      });
    }
    
    if (options.clearBower) {
      add('Clear bower folder', function(callback) {
        clear(bowerDirectory, callback);
      });
    }
    
    if (options.install) {
      add('Install bower dependencies', function(callback) {
        install(options.bowerOptions, callback);
      });
    }

    if (options.copy) {
      add('Copy main files to assets', function(callback) {
        copy(options, callback);
      });
    }

    async.series(tasks, done);
  });
};

Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }
  return a;
};