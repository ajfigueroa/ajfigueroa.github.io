const gulp = require('gulp');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const child = require('child_process');
const gutil = require('gulp-util');

// Constants used for referencing tasks
const minifyCssTask = 'minify-css';
const jekyllTask = 'jekyll';

// Minifies all the css into a single style.css file
gulp.task(minifyCssTask, () => {
    return gulp.src(['_css/poole.css', '_css/hyde.css', '_css/about.css', '_css/syntax.css', '_css/custom.css'])
      .pipe(cleanCss({compatibility: 'ie8'}))
      .pipe(concat('styles.css', {newLine: ' '}))
      .pipe(gulp.dest('assets'));
});

// Runs Jekyll as a child process
gulp.task(jekyllTask, () => {
    const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'serve', '--drafts']);

    const jekyllLogger = (buffer) => {
      buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('jekyll: ' + message));
    };
  
    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('watch', () => {
    gulp.watch('_css/*', [minifyCssTask]);
});
  
gulp.task('default', [minifyCssTask, jekyllTask, 'watch']);
