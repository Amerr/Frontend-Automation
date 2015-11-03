var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var plugins = require('gulp-load-plugins')();
function errorHandler(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('watch-css', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(plugins.connect.reload());
});

gulp.task('coffee', function(){
  return gulp.src('app/coffee/*.coffee')
    .pipe(plugins.coffee({bare: true}).on('error',errorHandler ))
    .pipe(gulp.dest('app/js'))
    .pipe(plugins.connect.reload());
});

gulp.task('webserver', function() {
  return plugins.connect.server({
    root: '.',
    port: 8001,
    livereload: true
  });

});

gulp.task('bower', function () {
  gulp.src('app/action-center.html')
    .pipe(wiredep())
    .pipe(gulp.dest('.'));

});

gulp.task('jade2html', function (){
  return gulp.src('app/jade/**.jade')
    .pipe(plugins.jade({pretty: true}).on('error', errorHandler ))
    .pipe(gulp.dest('app/'))
    .pipe(plugins.connect.reload());
});


gulp.task('w', function (){
  gulp.watch(['./app/sass/*.scss'], ['watch-css']);
  gulp.watch(['./app/coffee/**.coffee'], ['coffee']);
  gulp.watch(['app/**/**.html'], function (event){
      return gulp.src(event.path).pipe(plugins.connect.reload());
  });
});

gulp.task('watch', function (){
  gulp.watch(['app/scss/**.scss'], ['watch-css']);
  //
  gulp.watch(['app/js/**.js'], function (event){
      return gulp.src(event.path).pipe(plugins.connect.reload());
  });
  gulp.watch(['app/jade/**.jade'], ['jade2html']);

  gulp.watch(['app/jade/layouts/**.jade', 'app/jade/views/**.jade'], ['jade2html']);

  // gulp.watch(['**/**.html'], function (event){
  //     return gulp.src(event.path).pipe(plugins.connect.reload());
  // });
});

gulp.task('wire-jade', function (){
  gulp.src('app/jade/layouts/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
      exclude: ["bootstrap-material-design"]
    }))
    .pipe(gulp.dest('app/jade/layouts/'));
});

gulp.task('build', function (){

});


gulp.task('serve', ['bower', 'watch', 'webserver']);
