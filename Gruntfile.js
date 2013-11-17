module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        options: {
          shim: {
            jquery: {
              path: 'lib/jquery/jquery.js',
              exports: '$'
            }
          }
        },
        files: {
          'app.js': 'src/app.js'
        }
      }
    },

    clean: ['app.js'],

    watch: {
      scripts: {
        files: ['index.html', 'src/**/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          // change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost',
          livereload: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('server', ['build', 'connect', 'watch']);

};
/* vim:set ts=2 sw=2 et: */
