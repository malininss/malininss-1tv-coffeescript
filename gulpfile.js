const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function(done) {
  gulp.src("docs/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("docs/css"))
    .pipe(browserSync.stream());
  done();
});

gulp.task('serve', function(done) {

  browserSync.init({
    server: "docs/"
  });

  gulp.watch("docs/scss/*.scss", gulp.series('sass'));
  gulp.watch("docs/*.html").on('change', () => {
    browserSync.reload();
    done();
  });
  done();
});

gulp.task('default', gulp.series('sass', 'serve'));