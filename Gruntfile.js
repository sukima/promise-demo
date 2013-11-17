module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          'app.js': 'src/app.js'
        }
      }
    },

    clean: ['app.js'],

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('default', ['build']);

};
/* vim:set ts=2 sw=2 et: */
