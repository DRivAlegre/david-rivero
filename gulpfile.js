var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var webserver = require('gulp-webserver');
var sequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');

var PATHS = {
  sass: ['/app/src/scss/*.scss', './app/src/scss/**/*.scss'],
  html: ['./app/src/js/**/templates/*.html', './app/src/js/**/templates/**/*.html'],
  img: ['app/src/img/*.png', 'app/src/img/*.jpg', 'app/src/img/*.jpeg', 'app/src/img/*.svg']
};

gulp.task('html', function (done) {
	gulp.src(PATHS.html)
    .on('end', done);
});
gulp.task('sass', function (done) {
  var task = gulp.src(PATHS.sass);
  task = task
    .pipe(sass())
    .pipe(rename({ extname: '.css' }))
    .pipe(cleanCss());
  task
    .pipe(gulp.dest('./app/dist/css/'))
    .on('end', done);
});
gulp.task('ext-css', function (done) {
  var task = gulp.src(CSS_DEPS);
  task = task
    .pipe(rename({ extname: '.css' }))
    .pipe(cleanCss());
  task
    .pipe(gulp.dest('./app/dist/css/'))
    .on('end', done);
});
gulp.task('server', function () {
	gulp.src('./app').pipe(webserver({
		livereload: false,
	  host: 'localhost',
    port: 8000
	}));
});
gulp.task('min-img', function (done) {
  gulp.src(PATHS.img)
    .pipe(imagemin())
    .pipe(gulp.dest('./app/dist/img'))
    .on('end', done);
});
gulp.task('build', function (cb) {
  sequence(['sass', 'html'], cb);
});
gulp.task('watch', ['sass', 'html', 'server'], function () {
  gulp.watch(PATHS.sass, { interval: 1000 }, ['sass']);
  gulp.watch(PATHS.html, { interval: 1000 }, ['html']);
});
gulp.task('default', ['watch']);
