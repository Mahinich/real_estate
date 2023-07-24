const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function images() {
  return src(['src/images/src/*.*', '!src/images/src/*.svg'])
    .pipe(newer('src/images'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('src/images/src/*.*'))
    .pipe(newer('src/images'))
    .pipe(webp())

    .pipe(src('src/images/src/*.*'))
    .pipe(newer('src/images'))
    .pipe(imagemin())

    .pipe(dest('src/images'));
}

function styles() {
  return src('src/scss/style.scss')
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 version']
    }))
    .pipe(scss({ outputStyle: 'expanded' }))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src('src/js/scriptd.js')
    .pipe(concat('script.js'))
    // .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "src/"
    }
  });
  watch(['src/scss/**/*.scss'], styles);
  watch(['src/js/script.js'], scripts);
  watch(['src/images/src'], images);
  watch(['src/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('dist')
    .pipe(clean());
}

function building() {
  return src([
    'src/css/style.css',
    'src/js/script.js',
    'src/images/*.*',
    'src/fonts/dist/*.*',
    'src/*.html'
  ], { base: 'src' })
    .pipe(dest('dist'));
}

exports.styles = styles;
exports.images = images;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, watching);