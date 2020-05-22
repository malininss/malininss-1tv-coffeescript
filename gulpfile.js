const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const coffee = require('gulp-coffee');
const babel = require('gulp-babel');

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


gulp.task('scripts', function(done) {
  gulp.src("docs/scripts/*.coffee")
    .pipe(sourcemaps.init())
    .pipe(coffee({ bare: true }))
    .pipe(concat('script.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("docs/"))
    
    .pipe(browserSync.stream());
  done();
});

gulp.task('serve', function(done) {

  browserSync.init({
    server: "docs/"
  });

  gulp.watch("docs/scss/*.scss", gulp.series('sass'));
  gulp.watch("docs/scripts/*.coffee", gulp.series('scripts'));
  gulp.watch("docs/*.html").on('change', () => {
    browserSync.reload();
    done();
  });
  done();
});

gulp.task('default', gulp.series('sass', 'scripts', 'serve'));