/* eslint-env node */
/* eslint no-console: 0 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var babeljs = require('gulp-babel');
var annotate = require('gulp-ng-annotate');
//var es = require('event-stream');
var del = require('del');
var taskListing = require('gulp-task-listing');

var paths = {
  es2015: ['./src/**/*'],
  sass: ['./scss/**/*']
};

gulp.task('default', ['sass', 'build']);

// Add a task to render the output
gulp.task('help', taskListing);

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(babeljs())
    .pipe(annotate())
    .pipe(gulp.dest('www/js'));
});

gulp.task('webpack', function (callback) {
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true
    }));

    callback();
  });
});

gulp.task('clean', ['clean-js', 'clean-css']);

gulp.task('clean-js', function() {
  return del([
    'www/js/**/*'
  ]);
});

gulp.task('clean-css', function() {
  return del([
    'www/css/**/*'
  ]);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/dim.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  watch(paths.es2015, batch(function(events, done) {
    gulp.start('build', done);
  }));
  watch(paths.sass, batch(function(events, done) {
    gulp.start('sass', done);
  }));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(' ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
