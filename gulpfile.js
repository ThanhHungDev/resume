var gulp         = require('gulp')
var path         = require('path')
var sass         = require('gulp-sass')(require('sass'))
var uglify       = require('gulp-uglify')
var cssnano      = require('gulp-cssnano')
var autoprefixer = require('gulp-autoprefixer')
var fileinclude  = require('gulp-file-include')
var rename       = require("gulp-rename")
var cache        = require('gulp-cached')

// đầu tiên hãy tạo 1 thể hiện của browserSync
var browserSync = require('browser-sync').create();

var supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
];

gulp.task('sass', function () {
    return gulp.src('src/scss/**.scss')
        // .pipe(sass())
        // .pipe(autoprefixer({
        //     overrideBrowserslist: [
        //         ">0.2%",
        //         "not dead",
        //         "not op_mini all"
        //     ]
        // }))
        // .pipe(cssnano())
        .pipe(sass())
        .pipe(cssnano({
            autoprefixer: {browsers: supported, add: true}
        }))
        .pipe(gulp.dest(path.join(__dirname, 'dist/css'))) /// tạo mới folder
        .pipe(browserSync.stream({ match: '**/*.css' })) /// xem stream nó khác reload như nào nhé!!!
});

gulp.task('js', function () {
    return gulp.src("src/javascript/**.js")
        //    .pipe(cache('linting'))
        .pipe(uglify())/// anh thêm vào cho thấy được cái tên file nó sẽ build nhìn cho dễ
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.join(__dirname, '/dist/js/')))
});
gulp.task('fileinclude', function () {
    return gulp.src(["src/*.html"])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.join(__dirname, '/dist/')))
})
// RELOAD
gulp.task('reload', function () {
    browserSync.reload();
});
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    /// cấu hình html
    gulp.watch('src/*.html', gulp.series('fileinclude')).on("change", browserSync.reload)
    gulp.watch('src/partial/*.html', gulp.series('fileinclude')).on("change", browserSync.reload)
    /// cấu hình cho js
    gulp.watch("src/javascript/**.js", gulp.series('js')).on("change", browserSync.reload)
    /// cấu hình cho scss
    gulp.watch("src/scss/**.scss", gulp.series('sass'))
    gulp.watch("src/scss/partial/*.scss", gulp.series('sass'))
});