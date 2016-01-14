var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var child_process = require('child_process');
plugins.spawn = child_process.spawn;
plugins.browserSync = require('browser-sync');

var postcss = require('postcss');
var autoprefixer = require('gulp-autoprefixer')

var runSequence = require('run-sequence');

/**
 * Jekyll Build
 */

 var jekyllEnv = {
   dev: {
     env: 'development',
     config: 'app/_config.yml,app/_config.dev.yml'
   },
   production: {
     env: 'production',
     config: 'app/_config.yml'
   }
 }

var jekyllBuild = function jekyllBuild(jekyllEnv, done, destination) {

  if (!destination) {
    destination = '_site';
  }

  var environment_variables = Object.create(process.env);
  environment_variables.JEKYLL_ENV = jekyllEnv.env;

  return plugins.spawn(
    //'bundle',
    'jekyll',
    [
      // 'exec',
      // 'JEKYLL_ENV=' + jekyllEnv.env,
      //'jekyll',
      'build',
      '--source', 'app',
      '--destination', destination,
      '--plugins', 'plugins',
      '--config', jekyllEnv.config
    ],
    {
      env: environment_variables,
      stdio: 'inherit'
    }
  ).on('close', done);
}


gulp.task('jekyll:dev', function( done ) {
  jekyllBuild(jekyllEnv.dev, done);
});

gulp.task('jekyll:production', function( done ) {
  jekyllBuild(jekyllEnv.production, done);
});

gulp.task('jekyll:reload', ['jekyll:dev'], function() {
  plugins.browserSync.reload();
});



/**
 * SASS
 */

var autoprefixer_config = {
  browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Android >= 2.3']
}

var sass_development = function sass_development() {
  var task = gulp
    .src( 'app/assets/_scss/*.scss')
    .pipe(plugins.plumber())

    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    // .pipe(postcss([ autoprefixer(autoprefixer_config)] ))
    .pipe(autoprefixer(autoprefixer_config))
    .pipe(plugins.sourcemaps.write())

    .pipe(plugins.browserSync.reload({ stream: true }))
    .pipe(gulp.dest('.temp/development/assets/css'));

  return task;
}

var sass_production = function sass_production() {
  var nano_options = {
    // autoprefixer: autoprefixer_config,
    autoprefixer: false,
    discardComments: { removeAll: true }
  };

  var task = gulp
    .src( 'app/assets/_scss/*.scss')
    .pipe(plugins.plumber())

    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.cssnano(nano_options))
    .pipe(autoprefixer(autoprefixer_config))
  // Output to both _site and temp for crticial path
    .pipe( gulp.dest( '_site/assets/css' ) );
    // .pipe( gulp.dest( '.temp/production/assets/css' ) );

  return task;
}


gulp.task('sass:development', function() {
  return sass_development();
});

gulp.task('sass:production', function() {
  return sass_production();
});


/**
 * Browser Sync
 */

gulp.task('browser-sync', ['sass:development', 'jekyll:dev'], function() {

  plugins.browserSync({
    ui: false,
    server: {
      baseDir: ['_site', '.temp/development']
    },
    ghostMode: false,
    online: false,
    notify: false
  });

});


/**
 * Watch
 */

// add js to watch when necessary
 gulp.task('watch', ['sass:development'], function() {

   gulp.watch('app/assets/_scss/**/*.scss', ['sass:development']);
   gulp.watch('app/assets/_js/**/*.js', ['js:development']);
   gulp.watch([
     // 'app/_components/**/*.html',
     'app/_config.yml',
     'app/_config.dev.yml',
     'app/_includes/**/*.html',
     'app/_includes/**/*.md',
     'app/_layouts/**/*.html',
     // 'app/_pagetypes/**/*.html',
     // 'app/pages/*.html',
     'app/_pages/**/*.md',
     'app/assets/css/*.css',
     'app/images/**/*.{svg,png,jpg}',
     'app/assets/svg/*.svg',
     'app/_posts/**/*.md',
     'app/_drafts/**/*.md',
     // 'app/{.,atoms,molecules,organisms}/index.html',
     // 'app/{.,atoms,molecules,organisms}/index.html',
     'app/_data/*.yml',
     'app/*.html',
     // '_includes/**/*.html',
     // '_layouts/*.html',
     // 'img/**/*',
     // 'js/main.js'
   ], ['jekyll:reload']);

 });


/**
 * PRODUCTION
 */

 gulp.task('production', function(callback) {
   runSequence('jekyll:production',
               // add in parallel to assets:production task for js
               'sass:production',
               // 'assets:production',
               callback);
 });


/**
 * DEPLOY
 */

 gulp.task('deploy', ['production'], function() {

  return gulp
    .src('_site/**/*')
    .pipe(plugins.ghPages());

});


/**
 * DEFAULT
 */

gulp.task('default', ['browser-sync', 'watch']);
