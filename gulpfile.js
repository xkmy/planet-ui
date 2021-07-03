const path = require('path')
const gulp = require('gulp')
const concat = require('gulp-concat')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const size = require('gulp-filesize')

const DIR = {
  less: path.resolve(__dirname, './components/**/*.less'),
  buildSrc: [path.resolve(__dirname, './components/**/*.less')],
  lib: path.resolve(__dirname, './lib'),
  es: path.resolve(__dirname, './es'),
  dist: path.resolve(__dirname, './dist')
}

gulp.task('copyLess', () => {
  return gulp.src(DIR.less).pipe(gulp.dest(DIR.lib)).pipe(gulp.dest(DIR.es))
})

gulp.task('copyCss', () => {
  return gulp
    .src(DIR.buildSrc)
    .pipe(
      less({
        outputStyle: 'compressed'
      })
    )
    .pipe(autoprefixer())
    .pipe(size())
    .pipe(cssnano())
    .pipe(gulp.dest(DIR.lib))
    .pipe(gulp.dest(DIR.es))
})

gulp.task('buildCss', () => {
  return gulp
    .src(DIR.buildSrc)
    .pipe(
      less({
        outputStyle: 'compressed'
      })
    )
    .pipe(autoprefixer())
    .pipe(concat('planet-ui.css'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))

    .pipe(cssnano())
    .pipe(concat('planet-ui.min.css'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
})

gulp.task('default', gulp.series(['copyLess', 'copyCss', 'buildCss']))
