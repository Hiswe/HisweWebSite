'use strict';

var sharedVar       = require('./config/datas/stylus-var.json');
var rc = exports.rc = require('rc')('HISWE');
var uslug           = require('uslug');

var dbDst = __dirname + '/config/datas/'
exports.db = {
  src: 'config/datas',
  homeDst: dbDst     + 'db-home.json',
  projectsDst: dbDst + 'db-projects.json'
}

exports.revFiles = [
  'public/*min.js',
  'public/*min.css'
];

exports.pack = [
  './package.json',
  './bower.json'
];

exports.lib = {
  src: [
    'bower_components/modernizr/modernizr.js', // used by js
    'bower_components/modernizr/feature-detects/elem-progress-meter.js',
    'bower_components/pointerevents-polyfill/pointerevents.dev.js',
    'bower_components/PointerGestures/pointergestures.min.js',
    // jQuery
    'bower_components/jquery/dist/jquery.js',
    // Plugin depending on jQuery
    'bower_components/eventEmitter/EventEmitter.js', // imagesloaded dependencie
    'bower_components/eventie/eventie.js', // imagesloaded dependencie
    'bower_components/imagesloaded/imagesloaded.js',
    'bower_components/jquery-pointer-events/src/pointer.js',
    'bower_components/hevent/build/jquery.hevent.js'
  ],
  dst: 'public',
  srcMap: 'bower_components/PointerGestures/pointergestures.js.map',
  clean: 'public/lib*.js'
};

exports.css = {
  externalFiles: '',
  replace: {
    hisoFont: /(url\(')(hiso)/gi,
    fontawesome: /(url\('..\/fonts\/)(fontawesome)/gi
  },
  src: [
    'bower_components/hiso-font/font/hiso-font.css',
    'bower_components/hiso-font/font/hicon.css',
    // 'bower_components/fontawesome/css/font-awesome.css',
    'assets/css/front/index.styl'
  ],
  dst: 'public'
};

exports.front = {
  basedir: __dirname + '/assets/js/front',
  clean: 'public/app*js',
  dst: 'public'
};

exports.font = {
  src: [
    'bower_components/hiso-font/font/*',
    '!bower_components/hiso-font/font/*.css',
    'bower_components/fontawesome/fonts/*'
  ],
  dst: 'public/media/font'
};

var imgSrc = rc.GULP_SRC; // don't want a local path in my code :P
var imgDst = 'public/media/images/';
var uslugOptions = {
  lower: true,
  allowedChars: '-'
};
exports.img = {
  pixel:      [imgSrc + '*.{jpg,jpeg,png}', '!' + imgSrc + 'splash*.{jpg,jpeg,png}'],
  cleanPixel: [imgDst + '*.{jpg,jpeg,png}', '!' + imgDst + 'splash*.{jpg,jpeg,png}'],
  splash:     imgSrc + 'splash*.{jpg,jpeg,png}',
  cleanSplash:imgDst + 'splash*.{jpg,jpeg,png}',
  svg:        imgSrc + '*.svg',
  cleanSvg:   imgDst + '*.svg',
  dst:        imgDst,
  height:     sharedVar.carrouselHeight,
  width:      sharedVar.desktopWidth - ( sharedVar.desktopWidth * 0.1 ),
  fullDst:    __dirname + '/' + imgDst,
  formatOriginal: function formatOriginal(path) {
    path.basename = uslug(path.basename, uslugOptions);
  },
  formatPreview: function formatPreview (path) {
    path.basename = uslug(path.basename, uslugOptions) + '-preview';
  }
};

exports.serverSrc = 'media/images/';
