module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          'index.js': 'src/index.js'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');

};
/* vim:set ts=2 sw=2 et: */
