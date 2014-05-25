'use strict';

var fs          = require('fs');
var rev         = require('gulp-rev');
var gulp        = require('gulp');
var path        = require('path');
var exec        = require('child_process').exec;
var args        = require('yargs').argv;
var conf        = require('./gulp-config.js');
var bump        = require('gulp-bump');
var gutil       = require('gulp-util');
var clean       = require('gulp-clean');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var notify      = require('gulp-notify');
var gulpif      = require('gulp-if');
var concat      = require('gulp-concat');
var replace     = require('gulp-replace');
var plumber     = require('gulp-plumber');
var runsequence = require('run-sequence');
// css
var stylus      = require('gulp-stylus');
var minifyCSS   = require('gulp-minify-css');
// browserify js
var source      = require('vinyl-source-stream');
var coffeeify   = require('coffeeify');
var streamify   = require('gulp-streamify');
var browserify  = require('browserify');
// icons
var svgSprites  = require('gulp-svg-sprites');
var svg         = svgSprites.svg;
// images
var svgmin      = require('gulp-svgmin');
var resize      = require('gulp-image-resize');
var awspublish  = require('gulp-awspublish');
// server
var lr          = require('tiny-lr'); // livereload depend on tiny-lr
var wait        = require('gulp-wait');
var open        = require('gulp-open');
var nodemon     = require('gulp-nodemon');
var coffeelint  = require('gulp-coffeelint');
var livereload  = require('gulp-livereload');
// misc
var bundleData  = require('./gulp-task/hiswe-bundle-data');

/////////
// CONF & MISC
/////////

var server = lr();
var stylusVar   = require('./shared/stylus-var.json');

// Plumber error callback
var onError = function onError(err) {
  gutil.beep();
  console.log(err);
};

gulp.task('bump', function () {
  if (args.minor) return gulp.src(conf.pack).pipe(bump({type:'minor'})).pipe(gulp.dest('./'));
  if (args.major) return gulp.src(conf.pack).pipe(bump({type:'minor'})).pipe(gulp.dest('./'));
  return gulp.src(conf.pack).pipe(bump()).pipe(gulp.dest('./'));
});

gulp.task('rev', function () {
  gulp.src(conf.rev.src)
    .pipe(gulpif( /[.]css$/, minifyCSS({keepSpecialComments: 0})))
    // streamify is for handling browserify stream
    .pipe(gulpif( /[.]js$/, streamify(uglify({mangle: false}))))
    // no rename as the rev hash do this
    .pipe(rev())
    .pipe(gulp.dest(conf.rev.dst))
    .pipe(rev.manifest())
    .pipe(gulp.dest(conf.db.dst))
    .pipe(livereload(server));
});

gulp.task('tag', function (callback) {
  var pkg     = require('./package.json');
  var v       = 'v' + pkg.version;
  var message = (args.m == null)? 'Release ' + v : 'Release ' + v  + ' – ' + args.m;
  console.log('git ci -am "'+message+'"');
  console.log('git tag -a '+pkg.version+' -m "'+message+'"');
  console.log('git push --tags');
  callback();
});


gulp.task('heroku', function(cb){
  function execCb(err, stdout, stderr) {
    console.log(conf.heroku.format(stdout, args));
    return cb(err);
  }
  if (args.config)  exec('heroku config:pull --app hiswe', execCb);
  if (args.log)     exec('heroku logs -n 1000 --app hiswe', execCb);
});

// Upload to Amazon S3
gulp.task('upload', function () {
  var publisher = awspublish.create({
    key:    conf.rc.AWS_ACCESS_KEY_ID,
    secret: conf.rc.AWS_SECRET_KEY,
    bucket: conf.rc.AWS_BUCKET
  });

  return gulp.src( ['public/app-*.js', 'public/vendor-*.js', 'public/index-*.css', '!public/media/font/*','!public/media/icons/*', 'public/*/*/*'])
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    .pipe(publisher.sync()) // delete not-in-folder files
    .pipe(awspublish.reporter())
    .pipe(notify({title: 'HISWE', message: 'UPLOAD done', onLast: true}));
});

/////////
// CSS
/////////

gulp.task('stylus', ['clean-css'], function () {
  return gulp.src(conf.css.src)
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(/[.]styl$/, stylus({
      use: [require('nib')(), require('hstrap')()],
      define: stylusVar,
      set:['resolve url']
    })))
    .pipe(plumber.stop())
    .pipe(concat('index.css'))
    .pipe(replace(conf.css.replace.hisoFont, '$1./media/font/$2'))
    .pipe(gulp.dest(conf.css.dst))
    .pipe(notify(conf.msg('CSS build done')));
});

gulp.task('css', function(callback) {
  return runsequence('stylus', 'rev', callback);
});

gulp.task('clean-css', function() {
  return gulp.src('public/*.css', {read: false}).pipe(clean());
});

/////////
// JS
/////////

// LIBRARY

gulp.task('vendor', ['clean-vendor'], function () {
  var bundleStream = browserify({
      basedir: __dirname,
      noParse: conf.js.vendor.noParse
    })
    .require('wolfy87-eventemitter', {expose: 'eventEmitter'})
    .require('./gulp-task/browsernizr-conf.js', {expose: 'conf'})
    .require(conf.js.vendor.require)
    .transform('deglobalify')
    .bundle({
      detectGlobals: false
    }).on('error', onError);

  return bundleStream
    .pipe(source('vendor.js'))
    .pipe(gulp.dest(conf.public))
    .pipe(livereload(server))
    .pipe(notify(conf.msg('Vendor build done')));
});

gulp.task('clean-vendor', function() { return gulp.src(conf.js.vendor.clean, {read: false}).pipe(clean()); });

// FRONT-END APP
gulp.task('clean-app', function() { return gulp.src(conf.js.front.clean, {read: false}).pipe(clean());});

gulp.task('front-lint', function(){
  return gulp.src(conf.js.front.src)
    .pipe(coffeelint(conf.lint))
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'));
});

gulp.task('bundle-front', ['clean-app'], function() {
  // see https://github.com/hughsk/vinyl-source-stream example
  var bundleStream = browserify({
      entries: conf.js.front.src,
      basedir: conf.basedir,
      extensions: ['.js', '.json', '.coffee']
    })
    .transform(coffeeify)
    .external(conf.js.front.external)
    .bundle();

  return bundleStream
    .pipe(plumber({errorHandler: onError}))
    .pipe(source(conf.basedir + '/boot.coffee'))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(conf.public))
    .pipe(notify(conf.msg('FRONTEND APP build done')))
    .pipe(livereload(server));
});



gulp.task('front-app', function(callback) {
  return runsequence('front-lint', 'bundle-front', 'rev', callback);
});

gulp.task('js', function(callback) {
  return runsequence('front-lint', ['vendor', 'bundle-front'], 'rev', callback);
});

/////////
// ASSETS
/////////

// FONT
gulp.task('clean-font', function() { return gulp.src(conf.font.dst, {read: false}).pipe(clean()); });

gulp.task('font', ['clean-font'], function() {
  gulp.src(conf.font.src)
    .pipe(gulp.dest(conf.font.dst));
});

// ICONS

gulp.task('clean-icons', function() { return gulp.src(conf.icons.dst, {read: false}).pipe(clean());});

gulp.task('build-icons', ['clean-icons'], function () {
  return gulp.src(conf.icons.src)
    .pipe(rename(conf.icons.rename))
    .pipe(svg({
      defs:         true,
      svgId:        "icon-%f",
      className:    ".svgicon-%f",
      cssFile:      "hiswe-icons.css",
      svg: { defs:  "hiswe-icons.svg" }
    }))
    .pipe(gulp.dest(conf.icons.dst));
});

gulp.task('icons', ['build-icons'], function () {
  return gulp.src(conf.icons.finalSrc)
    .pipe(gulp.dest(conf.icons.finalDst));
});

/////////
// IMAGES
/////////

// Can't use gulp-if because gulp-resize don't rely on stream
// TODO: May have a workaround with gulp-streamify
gulp.task('clean-pixel', function() {
  return gulp.src(conf.img.cleanPixel, {read: false}).pipe(clean());
});

gulp.task('pixel', ['clean-pixel'], function() {
  return gulp.src(conf.img.pixel)
    .pipe(rename(conf.img.formatOriginal))
    .pipe(gulp.dest(conf.img.dst))
    .pipe(resize({height: conf.img.height, quality: 1}))
    .pipe(resize({width: conf.img.width, quality: 1}))
    .pipe(rename(conf.img.formatPreview))
    .pipe(gulp.dest(conf.img.dst))
});

gulp.task('clean-cover', function() {
  return gulp.src(conf.img.cleanCover, {read: false}).pipe(clean());
});

gulp.task('cover', ['clean-cover'], function() {
  return gulp.src(conf.img.cover)
    .pipe(rename(conf.img.formatOriginal))
    .pipe(resize({width: conf.img.coverWidth, quality: 1}))
    .pipe(gulp.dest(conf.img.dst))
});

gulp.task('clean-splash', function() {
  return gulp.src(conf.img.cleanPixel, {read: false}).pipe(clean());
});

gulp.task('splash', ['clean-splash'], function() {
  return gulp.src(conf.img.pixel)
    .pipe(rename(conf.img.formatOriginal))
    .pipe(gulp.dest(conf.img.dst))
    .pipe(rename(conf.img.formatPreview))
    .pipe(gulp.dest(conf.img.dst))
});

gulp.task('clean-svg', function() {
  return gulp.src(conf.img.cleanSvg, {read: false}).pipe(clean());
});

gulp.task('svg', ['clean-svg'], function() {
  return gulp.src(conf.img.svg)
    .pipe(svgmin())
    .pipe(rename(conf.img.formatOriginal))
    .pipe(gulp.dest(conf.img.dst));
});

gulp.task('list', function(cb) {
  var projectName = args.project;
  if (projectName != null) {
    var fileList = fs.readdirSync(conf.img.fullDst)
      .filter(function (item) {
        if (item.indexOf(projectName) === -1 ) return false;
        if (/preview/.test(item)) return false;
        return true
      });
      // .map(function (item) { return '- ![](media/images/' + item + ' "" )'; });
    console.log(fileList.join('\n'));
  } else {
    gutil.log('You should call ', gutil.colors.yellow('gulp list --project NAME'));
  }
  cb(null);
});

gulp.task('image', ['pixel', 'splash', 'svg', 'cover']);
gulp.task('resize', ['image']); // Aliase because I just often mess around

/////////
// JSON
/////////

gulp.task('json', function() {
  return gulp.src(conf.db.src)
    .pipe(bundleData())
    .pipe(gulp.dest(conf.db.dst));
});

/////////
// BUILD ALL
/////////

gulp.task('build', function(callback) {
  if (args.js != null)      return runsequence('front-lint', ['vendor', 'bundle-front'], 'rev', callback);
  if (args.lib != null)     return runsequence('vendor', 'rev', callback);
  if (args.css != null)     return runsequence('stylus', 'rev', callback);
  if (args.front != null)   return runsequence('front-lint', 'bundle-front', 'rev', callback);
  if (args.image === false) return runsequence('front-lint', ['bundle-front', 'vendor', 'stylus'], 'rev', callback);
  return runsequence('front-lint', ['icons', 'bundle-front', 'vendor', 'stylus', 'resize'], ['rev', 'json'], callback);
});

/////////
// SERVER
/////////

gulp.task('server-lint', function(){
  return gulp.src(conf.server.src)
    .pipe(coffeelint(conf.lint))
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'));
});

gulp.task('open-browser', function (){
  // Has to be a file in order to proceed…
  return gulp.src('./README.md').pipe(wait(1000)).pipe(open('', {url: "http://localhost:5000"}));
});

gulp.task('notify-restart', function () {
  // wait server to properly restart
  setTimeout(function() {
    gulp.src('').pipe(notify(conf.msg('restart server')));
    server.changed({body: {files: ['index.html']}});
  }, 1000);
});

// Watch
gulp.task('watch', function() {
  server.listen(35729, function (err) { if (err) { return console.log(err) }});
  gulp.watch(['./front/css/**/*.styl'], ['css']);
  gulp.watch(['./front/js/**/*.coffee'], ['front-app']);
  gulp.watch(['./server/datas/*.md'], ['json']);
  gulp.watch(['./server/**/*.coffee'], ['server-lint']);
  gulp.watch('./views/**/*.jade').on('change', function() {
    gulp.src('').pipe(notify(conf.msg('reload html')));
    server.changed({body: {files: ['index.html']}});
  });
});

// Nodemon server
gulp.task('express', ['server-lint'], function () {
  var env   = args.prod ? 'production' : 'development';
  var glob  = ['server/**/*.coffee', 'server/datas/db-*.json'];
  // ignore rev-manifest.json in dev mode
  if (args.prod) glob.push('server/datas/rev-manifest.json')
  nodemon({
    script: 'server.js', ext: 'coffee json', watch: glob,
    env: { 'NODE_ENV': env, 'hiswe_pouic': 'clapou'}
  })
  .on('restart', ['notify-restart'])
  .on('crash', onError);
});

gulp.task('server', function (callback){
  if (args.build != null) return runsequence(['watch', 'express'], 'open-browser', callback);
  return runsequence('build', ['watch', 'express'], 'open-browser', callback);
});

/////////
// DOC
/////////

gulp.task('doc', function(callback) {
  var m = gutil.colors.magenta
  var g = gutil.colors.grey
  console.log(m('bump'), g('..............'), 'patch version of json');
  console.log(m('  --minor'), g('.........'), 'minor version of json');
  console.log(m('  --major'), g('.........'), 'major version of json');
  console.log(m('heroku'), g('............'), 'Heroku related tasj');
  console.log(m('  --config'), g('........'), 'get heroku current conf');
  console.log(m('  --log'), g('...........'), 'get last 1000 log');
  console.log(m('rev'), g('...............'), 'Generate rev files');
  console.log(m('font'), g('..............'), 'Copy fonts to the right folder');
  console.log(m('json'), g('..............'), 'Package all datas to json');
  console.log(m('build'), g('.............'), 'js + css + rev');
  console.log(m('  --js'), g('............'), 'Concat & uglify all js + rev');
  console.log(m('  --lib'), g('...........'), 'Concat & uglify lib + rev');
  console.log(m('  --css'), g('...........'), 'Compile stylus + uglify + rev');
  console.log(m('  --front'), g('.........'), 'Concat & uglify front-end app + rev');
  console.log(m('  --no-image'), g('......'), 'build everything except images');
  console.log(m('pixel'), g('.............'), 'Resize pixel images');
  console.log(m('svg'), g('...............'), 'clean svg images');
  console.log(m('image'), g('.............'), 'pixel + svg');
  console.log(m('upload'), g('............'), 'upload assets to AWS');
  console.log(m('list'), g('..............'), 'list image');
  console.log(m('  --project name'), g('..'), 'of a specific project');
  console.log(m('server'), g('............'), 'Watch + server');
  console.log(m('  --no-build'), g('......'), 'Skip the build');
  console.log(m('  --prod'), g('..........'), 'Set environment to production');
  callback()
});

gulp.task('default', ['doc']);
