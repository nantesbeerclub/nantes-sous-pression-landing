var gulp = require('gulp');  
var sass = require('gulp-sass');  
var browserSync = require("browser-sync").create();
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var paths = {
    styles: {
        src: "styles/**/*.scss",
        dest: "css"
    }
};

function style() {
    return (
        gulp
            .src(paths.styles.src)
            .pipe(sass())
            .on("error", sass.logError)
            .pipe(gulp.dest(paths.styles.dest))
            .pipe(browserSync.stream())
    );
}

function reload() {
    browserSync.reload();
}
 
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch("./js/*.js")
    gulp.watch("*.html", reload);
}

var localFiles = ['./assets/**/*','./css/**/*.css','*.html'];

var user = process.env.FTP_USER;
var password = process.env.FTP_PASSWORD;

function getFtpConnection(){
     return ftp.create({
            host: 'ftp.cluster021.hosting.ovh.net',
            port: 21,
            user: user,
            password: password,
            log: gutil.log
      });
}

const remoteLocation = 'www';

function deploy() {
    var conn = getFtpConnection();
    return gulp.src(localFiles, {base: '.', buffer: false})
                .pipe(conn.newer(remoteLocation))
                .pipe(conn.dest(remoteLocation))
}

exports.style = style;
exports.watch = watch;
exports.deploy = deploy;