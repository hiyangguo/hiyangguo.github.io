/**
 * Created by Godfery on 2016/12/9.
 */
const gulp = require('gulp');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const htmlclean = require('gulp-htmlclean');

// 复制静态资源
gulp.task('cp', () => {
  gulp.src(['CNAME']).pipe(gulp.dest('public'));
  gulp.src(['static/**/*']).pipe(gulp.dest('public/static'));
  gulp.src(['uploads/**/*']).pipe(gulp.dest('public/uploads'));
});

// 压缩 public 目录 css
gulp.task('minify-css', function() {
  return gulp.src('./public/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public'));
});

// 压缩 public 目录 html
gulp.task('minify-html', function() {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'))
});

// 压缩 public/js 目录 js
gulp.task('minify-js', function() {
  return gulp.src('./public/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public'));
});

// 执行 gulp 命令时执行的任务
gulp.task('default', [
  'minify-html', 'minify-css', 'minify-js', 'cp'
]);