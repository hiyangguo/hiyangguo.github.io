/**
 * Created by Godfery on 2016/12/9.
 */
const gulp = require('gulp');
const minifycss = require('gulp-minify-css');
const htmlmin = require('gulp-htmlmin');
const htmlclean = require('gulp-htmlclean');

// 复制静态资源
function copy(cb) {
  gulp.src(['CNAME']).pipe(gulp.dest('public'));
  gulp.src(['static/**/*']).pipe(gulp.dest('public/static'));
  gulp.src(['uploads/**/*']).pipe(gulp.dest('public/uploads'));
  cb();
}

function minifyCss(cb) {
  gulp.src('./public/**/*.css').pipe(minifycss()).pipe(gulp.dest('./public'));
  cb();
}

function minifyHtml(cb) {
  gulp
    .src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(
      htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      })
    )
    .pipe(gulp.dest('./public'));
  cb();
}

exports.build = gulp.series(gulp.parallel(copy, minifyCss, minifyHtml));
