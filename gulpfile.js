var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var liveReload = require('gulp-livereload');
var dest = './client/dist';

gulp.task('browserify', function(){
    browserify('./client/src/js/main.jsx')
    .transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(dest +'/js'))
    .pipe(liveReload());
});

gulp.task('copy', function(){
    gulp.src('./client/src/*.html').pipe(gulp.dest(dest));
    gulp.src('./client/src/css/**/*.*').pipe(gulp.dest(dest+'/css'));
    gulp.src('./client/src/fonts/**/*.*').pipe(gulp.dest(dest+'/fonts'));
    gulp.src('./client/src/images/*.*').pipe(gulp.dest(dest+'/images'));
    gulp.src('./client/src/js/vendor/*.*').pipe(gulp.dest(dest+'/js/vendor'));
});

gulp.task('default',  ['browserify', 'copy'], function() {
    return true;
});

gulp.task('live',  ['browserify', 'copy'], function() {
    liveReload.listen();
    gulp.watch('./client/src/**/*.*', ['browserify', 'copy']);
});
