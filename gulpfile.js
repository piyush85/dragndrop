// include gulp
var gulp  = require('gulp');

// include non-gulp plugins
var stylish = require('jshint-stylish-cool'),
    mainBowerFiles = require('main-bower-files'),
    gulpsync = require('gulp-sync')(gulp),
    angularFileSort = require('gulp-angular-filesort'),
    plugins = require('gulp-load-plugins')();;

// define variables
var buildPath = {
    rootFolder : './build/',
    cssFolder: '/css',
    jsFolder: '/js',
    jsAppFolder: '/js/app',
    jsVendorFolder: '/js/vendor',
    viewFolder: '/views'
};

var sourcePath = {
    rootFolder: './app'
};

/*
 ** Code related to Dev Build
 */

// task for dev build
gulp.task('dev', gulpsync.sync(['del-clean', 'dev-html-copy', 'dev-inject-copy']));

//task for folder cleaning
gulp.task('del-clean', function() {
    return gulp.src([
            buildPath.rootFolder + buildPath.cssFolder,
            buildPath.rootFolder + buildPath.jsFolder,
            buildPath.rootFolder + buildPath.viewFolder,
            buildPath.rootFolder + '/*.*'
        ], { read: false })
        .pipe(plugins.rimraf({ force: true }));
});

//task for copying components html files in build folder
gulp.task('dev-html-copy', function() {
    return gulp.src(['./app/**/*.html','!./app/index.html'])
        .pipe(plugins.flatten({ includeParents: 2} ))
        .pipe(gulp.dest(buildPath.rootFolder + buildPath.viewFolder));
});

//task for injecting css & js files into html file and then copying vendor & html files to build folder
gulp.task('dev-inject-copy', function() {
    return gulp.src('./app/index.html')
        .pipe(plugins.inject(gulp.src([sourcePath.rootFolder + '/**/*.js'])
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter(stylish))
            .pipe(plugins.ngAnnotate())
            .pipe(gulp.dest(buildPath.rootFolder + buildPath.jsAppFolder))
            .pipe(angularFileSort())
            ,{relative: true, ignorePath: "../../build/"}))
        //APP css inject and build
        .pipe(plugins.inject(gulp.src(['./app/assets/less/app.less'])
            .pipe(plugins.less())
            .pipe(gulp.dest('./app/assets/css'))
            .pipe(gulp.dest(buildPath.rootFolder + buildPath.cssFolder))
            ,{relative: true, ignorePath: "../../build/"}))
        //vendor files inject and build
        .pipe(plugins.inject(gulp.src(mainBowerFiles({includeDev:true, filter: ['**/*.js']}))
            .pipe(gulp.dest(buildPath.rootFolder + buildPath.jsVendorFolder)), {name: 'bower',relative:true, ignorePath: "../../build/"}))
        .pipe(plugins.inject(gulp.src(mainBowerFiles({includeDev:true, filter: ['**/*.css']}))
            .pipe(gulp.dest(buildPath.rootFolder + buildPath.cssFolder)), {name: 'bower',relative:true, ignorePath: "../../build/"}))
        .pipe(gulp.dest(buildPath.rootFolder));
});



