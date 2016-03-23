var gulp = require( 'gulp' ),
    plugins = require( 'gulp-load-plugins' )( {
        scope: [ 'devDependencies' ],
        lazy: false
    } );

// Gulp Task for Sass
// Gulp Task for JS

// Gulp Task to run tests
gulp.task( 'tester', function ( ) {
    return gulp
        .src( [ __dirname + '/test/test-*.js' ], { read: false } )
        .pipe( plugins.mocha( { reporter: 'spec' } ) )
        .on( 'error', plugins.util.log )
        .on( 'end', plugins.util.log );
} );

// gulp watch
gulp.task( 'watch', function ( ) {
    gulp.watch( [ '**/*.js', '!node_modules/**/*.js' ], [ 'tester' ] );
} );

// RUN Tasks in Sequence for builds process
// gulp.task('build', function(cb){
//  runSequence(
//      'css',
//      'js',
//      'processjade',
//  function(err){
//      if (err){
//          console.log(err.message);
//      } else {
//          console.log("Build finished successfully");
//      }
//      cb(err);
//  });
// });

// gulp.task('default', ['build']);
