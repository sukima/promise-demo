module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      options: {
        shim: {
          jquery: {
            path: 'lib/jquery/jquery.js',
            exports: '$'
          }
        },
        noParse: ['lib/**/*.js'],
        alias: [
          'lib/jquery-ui/jquery-ui.js:jquery-ui'
        ]
      },
      dist: {
        files: {
          'app.js': 'src/app.js'
        }
      },
      spec: {
        files: {
          'spec/specs.js': ['spec/src/**/*helper.js', 'spec/src/**/*spec.js']
        }
      }
    },

    clean: ['app.js', 'spec/specs.js', 'styles/index.css'],

    watch: {
      scripts: {
        files: ['src/**/*.js', 'spec/src/**/*.js'],
        tasks: ['browserify'],
        options: { livereload: true }
      },
      html: {
        files: ['index.html', 'styles/**/*.css', 'spec/index.html', 'spec/lib/*', 'spec/fixtures/*'],
        options: { livereload: true }
      },
      style: {
        files: ['styles/**/*.styl'],
        tasks: ['stylus'],
        options: { livereload: true }
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
    },

    stylus: {
      compile: {
        options: {
          urlfunc: 'embedurl' // use embedurl('test.png') in our code to trigger Data URI embedding
        },
        files: {
          'styles/index.css': 'styles/index.styl'
        }
      }
    },

    'gh-pages': {
      src: [
        'images/**',
        'styles/**/*.css',
        'styles/images/*',
        'app.js',
        'index.html',
        'spec/lib/**',
        'spec/index.html',
        'spec/specs.js',
        'spec/fixtures/**'
      ]
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('build', ['browserify', 'stylus']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('server', ['build', 'connect', 'watch']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);

};
/* vim:set ts=2 sw=2 et: */
