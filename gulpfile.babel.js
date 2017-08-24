import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();

gulp.task('lint', () => gulp.src(['gulpfile.babel.js', './config/**/*.js', '.app/**/*.js'])
  .pipe(plugins.jshint())
  .pipe(plugins.livereload()));

gulp.task('start', () => {
  plugins.nodemon({
    script: 'server.js',
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

<<<<<<< HEAD
gulp.task('test', () => gulp.src(['./test/user/model.js', './test/game/game.js'], { read: false })
=======
gulp.task('test', () => gulp.src(['./test/game/game.js', './test/user/model.js'], { read: true })
>>>>>>> chore(gulpfile): add and configuure gulpfile.babel.js
  .pipe(plugins.coverage.instrument({
    pattern: ['**/test*'],
    debugDirectory: 'debug'
  }))
  .pipe(plugins.mocha())
  .pipe(plugins.coverage.gather())
  .pipe(plugins.coverage.format())
  .pipe(gulp.dest('reports')));

gulp.task('sass:watch', () => {
  plugins.livereload.listen();
  gulp.watch('./public/**/*.scss', ['sass']);
});

<<<<<<< HEAD
gulp.task('coveralls', ['test'], () => gulp.src('coverage/lcov.info')
=======
gulp.task('coveralls', ['est'], () => gulp.src('coverage/lcov.info')
>>>>>>> chore(gulpfile): add and configuure gulpfile.babel.js
  .pipe(plugins.coveralls())
  .pipe(plugins.exit()));

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
        .pipe(plugins.jasmine())
>>>>>>> chore(gulpfile): add and configuure gulpfile.babel.js
        .pipe(plugins.istanbul.writeReports())
        .pipe(plugins.istanbul.enforceThresholds({ thresholds: { global: 50 } }))
        .on('end', cb);
    });
});

gulp.task('bower', () => {
  plugins.bower();
});


gulp.task('default', ['lint', 'start']);
