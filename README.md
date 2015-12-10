# Destiny Item Manager

## Developer Instructions

### Setup Your Environment

The following instructions will assume that you have installed globally and configured the following:

1. [node & npm](https://nodejs.org)
2. [bower](https://github.com/bower/bower)
3. [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
4. [tsd](https://github.com/DefinitelyTyped/tsd)
5. [ionic](http://ionicframework.com/docs/guide/installation.html)

The steps to setup DIM on your computer are:

1. Clone DIM onto your hard drive.
2. Run the following commands from your command prompt in the root of the project:
	
>	`npm install`

>	`bower install`

>	`tsd install`

>	`ionic platform add ios`

>	`ionic platform add android`

>	`ionic setup sass`
	
3. Run DIM on your device or simulator with ionic.

### Gulp Tasks

While writing code, you'll need to execute gulp tasks to verify your modifcations.  The following tasks are availabe in gulp.

1. build
	* Transpiles the TypeScript code to ES2015 JavaScript.
	* Transpiles the ES2015 JavaScript to ES5 JavaScript.
	* Bundles the Module syntax of ES2015 to SystemJS.
2. bundle
	* Calls the build task.
	* Bundles the files in the /build folder and published them into the /www/js folder.
3. clean
	* Cleans the /build folder.