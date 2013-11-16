module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          'index.js': 'src/index.js'
        }
      }
    },

    clean: ["index.js"]

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['browserify']);

};
/* vim:set ts=2 sw=2 et: */
