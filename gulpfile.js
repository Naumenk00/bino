var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync= require('browser-sync');
var watch = require('gulp-watch');
var csso = require('gulp-csso');
var imageop = require('gulp-image-optimization');
// var postcss = require("gulp-postcss");
var autoprefixer = require('gulp-autoprefixer');
var data = require('gulp-data');
var svgSprite  = require('gulp-svg-sprite');
var uglify = require('gulp-uglify');
var handlebars = require('gulp-compile-handlebars');
// var rename = require('gulp-rename');

/******************************
 * Default task
 ******************************/

gulp.task('default', ['server','watch', 'templates', 'sass', 'js', 'copyAssets','fonts'], function() {});


/******************************
 * handlebars task
 ******************************/

gulp.task('templates', function () {
    var templateData = {
            firstName: 'Kaanon'
        };
    gulp.src('src/pages/*.html')
        .pipe(handlebars(templateData, {
            ignorePartials: true, //ignores the unknown partials
            partials: {
                footer: '<footer>the end</footer>'
            },
            batch: ['./src/components'],
            helpers: {
                capitals: function (str) {
                    return str.fn(this).toUpperCase();
                }
            }
        }))
        .pipe(gulp.dest('build'));
});

/******************************
 * svg-sprite task
 ******************************/

config                  = {
    mode                    : {
        defs                : true,
        symbol              : true,
        stack               : true
    }
}

gulp.task('svg-sprite', function () {
    return gulp.src('src/svg-sprite/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest("build/svg"));
});


/******************************
 * browserSync task
 ******************************/
reload = browserSync.reload;
gulp.task('server', function() {
    var files = [
        'build/*.html',
        'build/js/*.js',
        'build/css/*.css'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './build'
        },
        open: true
    });
});

/******************************
 * sass + prep task
 ******************************/
var sass_paths = [
    'src/sass/*.scss',
    'src/components/**/.scss'

];
gulp.task('sass', function () {
    return gulp.src(sass_paths)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(mqpacker())
        .pipe(csso())
        .pipe(gulp.dest('build/css'));

});
/******************************
 * js task
 ******************************/
gulp.task('js', function () {
    gulp.src('src/js/*.js')

        // .on('error', function(){notify("Javascript include error");})
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream: true}));
});
/******************************
 * img task
 ******************************/
gulp.task('images', function(cb) {
    gulp.src(['src/img/*.png','src/img/*.jpg','src/img/*.gif','src/img/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('build/img')).on('end', cb).on('error', cb);
});
/******************************
 * fonts task
 ******************************/
gulp.task('fonts', function() {
    return gulp.src(['src/fonts/**'])
        .pipe(gulp.dest('build/fonts'));
});
/******************************
 * assets task
 ******************************/

gulp.task('copyAssets', function () {
    'use strict';
    gulp.src([
        'src/img/*.*'
    ])
        .pipe(gulp.dest('build/img'));
});

/******************************
 * watch task
 ******************************/
gulp.task('img:watch', function () {
    gulp.watch('src/img/*.*', ['copyAssets']);
});
gulp.task('js:watch', function () {
    gulp.watch('src/js/*.js', ['js']);
});

gulp.task('sass:watch', function () {
    gulp.watch('src/sass/*.scss', ['sass']);
});

gulp.task('templates:watch', function () {
    gulp.watch('src/pages/*.html', ['templates']);
    gulp.watch('src/components/**/*.html', ['templates']);

});



gulp.task('watch',
    [
        'sass:watch',
        'templates:watch',
        'js:watch',
        'img:watch'

    ]
);

/******************************
 * final
 ******************************/
gulp.task('build',
    [
        'sass',
        'templates',
        'images',
        'fonts',
        'svg:sprites'

    ]
);
