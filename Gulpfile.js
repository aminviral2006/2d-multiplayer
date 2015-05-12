'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    debowerify = require('debowerify'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    cssimport = require('gulp-import-css' ),
    autoprefixer = require('gulp-autoprefixer' );
var concatCss = require('gulp-concat-css');

// Dev task
gulp.task('dev', ['clean', 'views', 'styles', 'lint', 'browserify'], function() { });

// Clean task
gulp.task('clean', function() {
	gulp.src('./dist/views', { read: false }) // much faster
  .pipe(rimraf({force: true}));
});

// JSHint task
gulp.task('lint', function() {
  gulp.src('app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function() {
  gulp.src('app/styles/*.scss')
  .pipe(sass({onError: function(e) { console.log(e); } }))
  .pipe(concatCss('bundle.css'))
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  .pipe(gulp.dest('dist/css/'));
});

// Browserify task
gulp.task('browserify', function() {
  gulp.src(['app/scripts/application.js'])
  .pipe(browserify({
    transform: ['debowerify'],
    insertGlobals: true,
    debug: false
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('dist/js'));
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('app/index.html')
  // And put it in the dist folder
  .pipe(gulp.dest('dist/'));

  // Any other view files from app/views
  gulp.src('app/views/**/*')
  // Will be put in the dist/views folder
  .pipe(gulp.dest('dist/views/'));
});

gulp.task('watch', ['lint'], function() {

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);
  // Watch our sass files
  gulp.watch(['app/styles/**/*.scss'], [
    'styles'
  ]);

  gulp.watch(['app/**/*.html'], [
    'views'
  ]);

});

gulp.task('default', ['dev', 'watch']);
