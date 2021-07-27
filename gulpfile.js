// Importar las funciones específicas de la API de gulp que vamos a utilizar
const { src, dest, series, parallel, watch } = require('gulp');

// Importar los paquetes con los que vamos a trabajar
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const del = require("del");
const merge = require("merge-stream");
const browserSync = require('browser-sync').create();

// Constantes de trabajo
const files = {
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js',
    htmlPath: 'dist/**/*.html',

    /* Custom JS files */
    jsFiles: [
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/jquery-migrate-3.0.1.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'src/js/jquery.easing.1.3.js',
        'src/js/jquery.waypoints.min.js',
        'src/js/jquery.stellar.min.js',
        'src/js/owl.carousel.min.js',
        'src/js/jquery.magnific-popup.min.js',
        'src/js/aos.js',
        'src/js/jquery.animateNumber.min.js',
        'src/js/bootstrap-datepicker.js',
        'src/js/jquery.timepicker.min.js',
        'src/js/google-map.js',
        'src/js/main.js'
    ]
}


/**
 * Compilar los archivos de sass en estilos en cascada para el navegador (CSS)
 */
function scssTask() {
    return src([files.scssPath])
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}


/**
 * Combinar y minificar los archivos de JS del proyecto
 */
function jsTask() {
    return src(files.jsFiles)
        .pipe(concat('bundle.js'))
        .pipe(dest('dist/js'))
        .pipe(minify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}


/**
 * Browsersync tasks and utilities
 */
function serveTask(d) {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
    d();
}
function reloadTask(d) {
    browserSync.reload();
    d();
}


/**
 * Métodos para las librerías externas utilizadas
 */
 
// Limpiar los archivos de terceros antiguos
function cleanTask() {
    return del(["./dist/vendor/"]);
}

// Copiar las librerías de terceros de node_modules en nuestro directorio de vendor
function modulesTask() {
    // Font Awesome CSS
    var fontAwesomeCSS = src('./node_modules/@fortawesome/fontawesome-free/css/**/*')
      .pipe(dest('./dist/vendor/fontawesome-free/css'));

    return merge(fontAwesomeCSS);
  }

/**
 * Observar cambios en los archivos de sass para compilarlos automaticamente
 */
function watchTask() {
    watch( [files.scssPath], scssTask );
    watch( [files.jsPath], jsTask );
    watch( [files.htmlPath], reloadTask );
}

exports.default = series(scssTask, jsTask, serveTask, watchTask);
exports.build = series(cleanTask, modulesTask);
exports.serve = serveTask;
exports.clean = cleanTask;