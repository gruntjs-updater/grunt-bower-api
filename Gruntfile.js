/*
 * grunt-bower-api
 * https://github.com/FKobus/grunt-bower-api
 *
 * Copyright (c) 2014 Ferry Kobus
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['bower', 'assets']
    },

    // Configuration to be run (and then tested).
    bower_api: {
      install: {
        options: {
          clearAssets: true,
          clearBower: true,
          install: true,
          copy: true,
          preservePaths: false,
          copyTo: {
            '.js': './assets/js',
            '.css': './assets/css'
          }
        }
      },
      cleanup: {
        options: {
          clearAssets: true,
          clearBower: true,
          install: false,
          copy: false
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'bower_api']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
