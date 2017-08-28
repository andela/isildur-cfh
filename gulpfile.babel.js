import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();

gulp.task('lint', () => gulp.src(['gulpfile.babel.js', './config/**/*.js', '.app/**/*.js'])
  .pipe(plugins.jshint())
  .pipe(plugins.livereload()));

gulp.task('start', () => {
  plugins.nodemon({
    script: 'dist/server.js',
    ext: 'js html jade',
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('sass', () => gulp.src('./public/**/*.scss')
  .pipe(plugins.sass().on('error', plugins.sass.logError))
  .pipe(gulp.dest('./css'))
  .pipe(plugins.livereload()));

gulp.task('jasmine', () => {
  gulp.src('./test/**/*.js')
    .pipe(plugins.jasmine());
});

gulp.task('test', () => gulp.src(['./test/user/model.js', './test/game/game.js'], { read: false })
  .pipe(plugins.coverage.instrument({
    pattern: ['**/test*'],
    debugDirectory: 'debug'
  }))
  .pipe(plugins.mocha({
    timeout: 15000
  }))
  .pipe(plugins.coverage.gather())
  .pipe(plugins.coverage.format())
  .pipe(gulp.dest('reports')));

gulp.task('sass:watch', () => {
  plugins.livereload.listen();
  gulp.watch('./public/**/*.scss', ['sass']);
});

gulp.task('coveralls', ['est'], () => gulp.src('coverage/lcov.info')
  .pipe(plugins.coveralls())
  .pipe(plugins.exit()));


gulp.task('public', () => gulp.src([
  './public/**/*',
  './app/**/*',
  './config/**/*',
  './css/**/*',
  'test/**/*'
], {
  base: './'
})
  .pipe(gulp.dest('dist')));

gulp.task('transpile', ['public'], () => gulp.src(['./**/*.js', '!dist/**', '!node_modules/**', '!bower_components/**', '!public/lib/**'])
  .pipe(plugins.babel({

  }))
  .pipe(gulp.dest('dist')));

gulp.task('coverage', (cb) => {
  gulp.src(['app/**/*.js', 'config/**/*.js'])
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', () => {
<<<<<<< HEAD
      gulp.src(['/test/user/model.js', 'test/game/game.js'], { read: false })
        .pipe(plugins.mocha({
          timeout: 20000
        }))
=======
      gulp.src(['test/game/game.js', '/test/user/model.js'])
        .pipe(plugins.injectModules())
        .pipe(plugins.mocha())
>>>>>>> chore(istanbul): add-test-reporter
        .pipe(plugins.istanbul.writeReports())
        .pipe(plugins.istanbul.enforceThresholds({ thresholds: { global: 50 } }))
        .on('end', cb);
    });
});

gulp.task('bower', () => {
  plugins.bower();
});


gulp.task('default', ['transpile', 'test', 'lint', 'start']);
