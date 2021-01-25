const { src, dest, watch, series, parallel } = require('gulp');

// Importing all the Gulp-related packages we want to use
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const sitemap = require('gulp-sitemap');
const save = require('gulp-save');
// File paths
const files = {
  imagePath: 'src/assets/images/**/*.+(png|jpg|jpeg|gif|svg|ico)',
  htmlPath: 'src/*.html',
  cssPath: 'src/css/style.css',
  jsPath: 'src/js/script.js',
  fontsPath: 'src/assets/fonts/*',
};

//clean dist folder
function clean() {
  return del('build');
}
// image

function imageTask() {
  return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('build/assets/images'));
}
// Task to minify HTML
function htmlTask() {
  return src(files.htmlPath).pipe(htmlmin()).pipe(dest('build/'));
}

// css task: compiles the css file into style.css
function cssTask() {
  return src(files.cssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('build/css')); // put final CSS in dist/css folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));
}

// fontsTask
function fontsTask() {
  return src(files.fontsPath).pipe(dest('build/assets/fonts'));
}

//sitemap
function sitemapTask() {
  return src('build/**/*.html', {
    read: false,
  })
    .pipe(save('before-sitemap'))
    .pipe(
      sitemap({
        siteUrl: 'https://www.sayyedulbappy.tech/',
      })
    ) // Returns sitemap.xml
    .pipe(dest('build'))
    .pipe(save.restore('before-sitemap'));
}

// Watch task: watch CSS and JS files for changes
// If any change, run css and js tasks simultaneously
function watchTask() {
  watch(
    files.imagePath + files.htmlPath + files.cssPath + files.jsPath,

    series(htmlTask, parallel(cssTask, jsTask), cacheBustTask, sitemapTask)
  );
}
const build = series(
  clean,
  imageTask,
  fontsTask,
  htmlTask,
  parallel(cssTask, jsTask),
  sitemapTask
);

// Export the default Gulp task so it can be run
// Runs the css and js tasks simultaneously
// then runs cacheBust, then watch task
exports.clean = clean;
exports.image = imageTask;
exports.html = htmlTask;
exports.sitemap = sitemapTask;
exports.build = build;
exports.watch = series(watchTask);
exports.default = series(build, watch);
