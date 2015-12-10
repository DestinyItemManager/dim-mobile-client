var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var ts = require('gulp-typescript');
var babeljs = require('gulp-babel');
var annotate = require('gulp-ng-annotate');
var es = require('event-stream');
var Builder = require('systemjs-builder');
var del = require('del');
var taskListing = require('gulp-task-listing');

var paths = {
  es2015: ['./src/**/*'],
  sass: ['./scss/**/*']
};

gulp.task('default', ['sass', 'bundle']);
 
// Add a task to render the output 
gulp.task('help', taskListing);

gulp.task('build', ['clean-js'], function (done) {
  var typescripts = gulp.src('src/**/*.ts')
    .pipe(ts({
      target: 'ES6'
    }));
  var es6scripts = gulp.src('src/**/*.js');

  return es.merge(typescripts.js, es6scripts)
    .pipe(babeljs())
    .pipe(annotate())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', ['clean-js', 'clean-css']);

gulp.task('clean-js', function () {
  return del([
    'build/**/*'
  ]);
});

gulp.task('clean-css', function () {
  return del([
    'www/css/**/*'
  ]);
});

gulp.task('bundle', ['build'], function (done) {
  var builder = new Builder('build', 'builder.json');
  
  gulp.src('./node_modules/babel-polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('./www/js'));

  builder
    .bundle('app.module.js', 'www/js/dim-bundle.js', {
      minify: true,
      sourceMaps: true
    })
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.error('Build error:', err);
    });
});

gulp.task('sass', function (done) {
  gulp.src('./scss/dim.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.es2015, ['build']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
    process.exit(1);
  }
  done();
});
