var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var plugins = require('gulp-load-plugins')();

var scss_src = ["app/scss/*.scss", "app/scss/*.sass"];
var scss_dest = "app/css";
var coffee_src = ["app/coffee"];
var coffee_dest = "app/js";
var index_file = "index.html";
var jade_src = ["app/jade/**.jade"];
var jade_dest= "app/";
// ErrorHandler, gulp watch needs 'end' event to proceed to cycle without breaking watch flow.
function errorHandler(err) {
  console.log(err.toString());
  this.emit('end');
}

// Task to Compile scss to css
gulp.task('sass2css', function() {
  return gulp.src(scss_src)
    .pipe(plugins.plumber())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(scss_src))
    .pipe(plugins.connect.reload());
});

// Task to Compile coffee to js
gulp.task('coffee2js', function(){
  return gulp.src(coffee_src)
    .pipe(plugins.coffee({bare: true}).on('error',errorHandler ))
    .pipe(gulp.dest(coffee_dest))
    .pipe(plugins.connect.reload());
});

// Local static server
gulp.task('webserver', function() {
  return plugins.connect.server({
    root: '.',
    port: 8001,
    livereload: true
  });

});

// Wire up third-part Dependencies library to HTML Markup
gulp.task('bower', function () {
  gulp.src(index_file)
    .pipe(wiredep())
    .pipe(gulp.dest('.'));

});

// Wire up third-part Dependencies library to Jade Markup
gulp.task('wire-jade', function (){
  gulp.src('app/jade/layouts/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
      exclude: ["bootstrap-material-design"]
    }))
    .pipe(gulp.dest('app/jade/layouts/'));
});

// Taskt to Convert Jade to hTML
gulp.task('jade2html', function (){
  return gulp.src(jade_src)
    .pipe(plugins.jade({pretty: true}).on('error', errorHandler ))
    .pipe(gulp.dest(jade_dest))
    .pipe(plugins.connect.reload());
});


gulp.task('watch', function (){
  gulp.watch(sass_src, ['sass2css']);

  gulp.watch(coffee_src, ['coffee2js']);

  gulp.watch(['app/js/**.js'], function (event){
      return gulp.src(event.path).pipe(plugins.connect.reload());
  });

  gulp.watch(jade_src, ['jade2html']);

  // If there is any paritals in Jade
  gulp.watch(['app/jade/layouts/**.jade', 'app/jade/views/**.jade'], ['jade2html']);

});




gulp.task('build', function (){

});


gulp.task('serve', ['bower', 'watch', 'webserver']);
