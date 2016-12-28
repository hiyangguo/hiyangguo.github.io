/**
 * Created by Godfery on 2016/12/9.
 */
const gulp = require('gulp');
const path = require('path');

gulp.task('cp', () => {
    gulp.src(['static/**/*']).pipe(gulp.dest('public/static'));
    gulp.src(['uploads/**/*']).pipe(gulp.dest('public/uploads'));
});