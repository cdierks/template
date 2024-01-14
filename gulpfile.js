// ES Module Imports
import gulp from 'gulp';
import * as sassModule from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import browserSyncLib from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';

// Initialisierung von Browser-Sync und gulp-sass
const browserSync = browserSyncLib.create();
const sass = gulpSass(sassModule);

// SCSS kompilieren und in /dist/design ablegen
export function compileSCSS() {
    return gulp.src('./source/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/design'))
        .pipe(browserSync.stream());
}

// HTML-Dateien in /dist kopieren
export function htmlTask() {
    return gulp.src('./source/html/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}

// JavaScript-Dateien in /dist/design/js kopieren
export function jsTask() {
    return gulp.src('./source/js/**/*.js')
        .pipe(gulp.dest('./dist/design/js'))
.pipe(browserSync.stream());
}

// Bilder optimieren und in /dist/design/img kopieren
export function optimizeImages() {
return gulp.src('./source/img/**/*')
.pipe(changed('./dist/design/img'))
.pipe(imagemin())
.pipe(gulp.dest('./dist/design/img'))
.pipe(browserSync.stream());
}

// Schriftartendateien von /source/web-fonts/ nach /dist/design/fonts/ kopieren
export function fontTask() {
    return gulp.src('./source/web-fonts/**/*')
        .pipe(gulp.dest('./dist/design/fonts'))
        .pipe(browserSync.stream());
}

// Live-Server starten und Dateiänderungen überwachen
export function serve() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('./source/scss/**/*.scss', compileSCSS);
    gulp.watch('./source/html/**/*.html', htmlTask);
    gulp.watch('./source/js/**/*.js', jsTask);
    gulp.watch('./source/img/**/*', optimizeImages);
    gulp.watch('./source/web-fonts/**/*', fontTask); // Neuer Watcher
}

// Standard-Gulp-Task festlegen
const build = gulp.series(compileSCSS, htmlTask, jsTask, optimizeImages, fontTask, serve);
export default build;