var gulp = require('gulp'),
	connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
  	root: 'src',
    port: 8889
  });
});

gulp.task('default', ['connect']);