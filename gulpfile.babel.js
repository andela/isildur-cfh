import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();
gulp.task('lint', () => gulp.src(
  [
    'gulpfile.babel.js',
    './config/**/*.js',
    '.app/**/*.js'
  ]
)
  .pipe(plugins.jshint())
  .pipe(plugins.livereload()));
gulp.task('transpile', ['public'], () => {
  gulp.src(
    [
      './**/*.js',
      '!dist/**',
      '!node_modules/**',
      '!bower_components/**',
      '!public/lib/**'
    ]
  )
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['public'], () => {
  plugins.nodemon({
    watch: ['./dist', './app', './config', './public'],
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
gulp.task('test', () => gulp.src(
  [
    './dist/test/game/game.js',
    './dist/test/user/model.js'
  ],
  { read: false }
)
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

gulp.task('watch', () => {
  plugins.livereload.listen();
  gulp.watch('./public/**/*.scss', ['sass', 'transpile']);
  gulp.watch('./public/**/*.html', ['sass', 'transpile']);
  gulp.watch('./public/**/*.css', ['sass', 'transpile']);
  gulp.watch('./public/**/*.js', ['sass', 'transpile']);
});
gulp.task('coveralls', ['test'], () => gulp.src('coverage/lcov.info')
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

gulp.task('coverage', (cb) => {
  gulp.src(['app/**/*.js', 'config/**/*.js'])
    .pipe(plugins.babel())
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', () => {
      gulp.src(
        [
          ('./test/**/*.js')

        ]
      )
        .pipe(plugins.babel())
        .pipe(plugins.injectModules())
        .pipe(plugins.jasmine())
        .pipe(plugins.istanbul.writeReports())
<<<<<<< HEAD
        .pipe(plugins.istanbul.enforceThresholds({
          thresholds: { global: 20 } }))
=======
        .pipe(plugins.istanbul.enforceThresholds({ thresholds: { global: 20 } }))
>>>>>>> e052f667eaf1f30d6c87036766995b72afe74d6a
        .on('end', cb);
    });
});

gulp.task('coveralls', ['coverage'], () => gulp.src('coverage/lcov.info')
  .pipe(plugins.coveralls())
  .pipe(plugins.exit()));

gulp.task('bower', () => {
  plugins.bower({ directory: './bower_components' })
    .pipe(gulp.dest('./public/lib'));
});


<<<<<<< HEAD
gulp.task('default', ['bower', 'transpile', 'serve', 'watch']);
=======
gulp.task('default', ['transpile', 'serve', 'watch']);
>>>>>>> e052f667eaf1f30d6c87036766995b72afe74d6a
