'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpLoadPlugins = require('gulp-load-plugins');

var _gulpLoadPlugins2 = _interopRequireDefault(_gulpLoadPlugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugins = (0, _gulpLoadPlugins2.default)();

_gulp2.default.task('lint', function () {
  return _gulp2.default.src(['gulpfile.babel.js', './config/**/*.js', '.app/**/*.js']).pipe(plugins.jshint()).pipe(plugins.livereload());
});

_gulp2.default.task('start', function () {
  plugins.nodemon({
    script: 'dist/server.js',
    ext: 'js html jade',
    env: { NODE_ENV: 'development' }
  });
});

_gulp2.default.task('sass', function () {
  return _gulp2.default.src('./public/**/*.scss').pipe(plugins.sass().on('error', plugins.sass.logError)).pipe(_gulp2.default.dest('./css')).pipe(plugins.livereload());
});

_gulp2.default.task('jasmine', function () {
  _gulp2.default.src('./test/**/*.js').pipe(plugins.jasmine());
});

_gulp2.default.task('test', ['transpile'], function () {
  return _gulp2.default.src(['./dist/test/game/game.js', './dist/test/user/model.js'], { read: false }).pipe(plugins.coverage.instrument({
    pattern: ['**/test*'],
    debugDirectory: 'debug'
  })).pipe(plugins.mocha({
    timeout: 15000
  })).pipe(plugins.coverage.gather()).pipe(plugins.coverage.format()).pipe(_gulp2.default.dest('reports'));
});

_gulp2.default.task('sass:watch', function () {
  plugins.livereload.listen();
  _gulp2.default.watch('./public/**/*.scss', ['sass']);
});

_gulp2.default.task('coveralls', ['test'], function () {
  return _gulp2.default.src('coverage/lcov.info').pipe(plugins.coveralls()).pipe(plugins.exit());
});

_gulp2.default.task('public', function () {
  return _gulp2.default.src(['./public/**/*', './app/**/*', './config/**/*', './css/**/*', 'test/**/*'], {
    base: './'
  }).pipe(_gulp2.default.dest('dist'));
});

_gulp2.default.task('transpile', ['public'], function () {
  return _gulp2.default.src(['./**/*.js', '!dist/**', '!node_modules/**', '!bower_components/**', '!public/lib/**']).pipe(plugins.babel({})).pipe(_gulp2.default.dest('dist'));
});

_gulp2.default.task('coverage', function (cb) {
  _gulp2.default.src(['app/**/*.js', 'config/**/*.js']).pipe(plugins.istanbul()).pipe(plugins.istanbul.hookRequire()).on('finish', function () {
    _gulp2.default.src(['/test/user/model.js', 'test/game/game.js']).pipe(plugins.injectModules()).pipe(plugins.mocha()).pipe(plugins.istanbul.writeReports()).pipe(plugins.istanbul.enforceThresholds({ thresholds: { global: 50 } })).on('end', cb);
  });
});

_gulp2.default.task('bower', function () {
  plugins.bower();
});

_gulp2.default.task('default', ['transpile', 'lint', 'start']);