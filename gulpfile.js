const { watch, src, dest, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pixrem = require('gulp-pixrem');

const config = {
    app: {
        js: [
            './src/js/**/*.js',
        ],
        scss: './src/sass/**/*.scss',
        fonts: './src/fonts/*',
        images: './src/images/*.*',
        html: './src/*.html',
        php: './src/*.php'
    },
    dist: {
        base: './dist/',
        js: './dist/js',
        css: './dist/css/',
        fonts: './dist/fonts',
        images: './dist/images'
    },
    extraBundles: [
        './dist/main.js',
        './dist/main.css'
    ]
}

function jsTask(done) {
    src(config.app.js)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest(config.dist.js))
    done();
}

function cssTask(done) {
    src(config.app.scss)
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(pixrem({
            rootValue: '10px',
            replace: true
          }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest(config.dist.css))
    done();
}

function fontTask(done) {
    src(config.app.fonts)
        .pipe(dest(config.dist.fonts))
    done();
}

function imagesTask(done) {
    src(config.app.images)
        .pipe(dest(config.dist.images))
    done();
}

function templateTask(done) {
    src(config.app.html)
        .pipe(dest(config.dist.base))
    done();
}

function phpTask(done) {
    src(config.app.php)
        .pipe(dest(config.dist.base))
    done();
}

function watchFiles() {
    watch(config.app.js, series(jsTask, reload));
    watch(config.app.scss, series(cssTask, reload));
    watch(config.app.fonts, series(fontTask, reload));
    watch(config.app.images, series(imagesTask, reload));
    watch(config.app.html, series(templateTask, reload));
    watch(config.app.php, series(phpTask, reload));
}

function liveReload(done) {
    browserSync.init({
        server: {
            baseDir: config.dist.base
        },
    });
    done();
}

function reload (done) {
    browserSync.reload();
    done();
}

function cleanUp() {
    return del([config.dist.base]);
}

exports.dev = parallel(jsTask, cssTask, fontTask, imagesTask, templateTask, phpTask, watchFiles, liveReload);
exports.build = series(cleanUp, parallel(jsTask, cssTask, fontTask, imagesTask, templateTask, phpTask));