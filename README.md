# grunt-bower-api

> Grunt task for maintaining bower

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bower-api --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bower-api');
```

## The "bower_api" task

### Overview
In your project's Gruntfile, add a section named `bower_api` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bower_api: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.clearAssets
Type: `Boolean`
Default value: `false`

A boolean that indicates that the assets directory needs to be cleared before installing

#### options.clearBower
Type: `Boolean`
Default value: `false`

A boolean that indicates that the bower directory needs to be cleared before installing

#### options.assetsDirectory
Type: `String`
Default value: `./assets`

A directory where to store the mailfiles of bower components

#### options.install
Type: `Boolean`
Default value: `true`

Install bower components

#### options.copy
Type: `Boolean`
Default value: `true`

Copy mainfiles to assetsDirectory after installing

#### options.bowerOptions
Type: `Object`
Default value: `{}`

Add your own bower options when installing bower components

#### options.preservePaths
Type: `Boolean`
Default value: `false`

Keep the original endpoints of the main files when copying to assets folder? When true it will not use copyTo and leave the package folder structure.

#### options.copyTo
Type: `Object`
Default value: `{'*.js': './assets/js', '*.css': './assets/css'}`

Copy specific file extension to specific folders. 


### Usage Examples

#### Default Options

```js
grunt.initConfig({
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
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
Initial release
