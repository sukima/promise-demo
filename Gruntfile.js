module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      libs: {
        options: {
          shim: {
            jquery: {
              path: './lib/jquery/jquery.js',
              exports: 'jQuery'
            },
            jquery_ui: {
              path: './lib/jquery-ui/jquery-ui.js',
              exports: null,
              depends: {
                jquery: 'jQuery'
              }
            }
          }
        },
        src: ['./lib/**/*.js'],
        dest: 'libs.js'
      },
      app: {
        options: {
          alias: [
            './lib/jquery/jquery.js:jquery',
            './lib/jquery-ui/jquery-ui.js:jquery_ui'
          ],
          external: [
            './lib/jquery/jquery.js',
            './lib/jquery-ui/jquery-ui.js'
          ]
        },
        src: ['src/bootstrap.js'],
        dest: 'app.js'
      },
      specs: {
        options: {
          alias: [
            './lib/jquery/jquery.js:jquery',
            './lib/jquery-ui/jquery-ui.js:jquery_ui'
          ],
          external: [
            './lib/jquery/jquery.js',
            './lib/jquery-ui/jquery-ui.js'
          ]
        },
        src: ['spec/src/**/**helper.js', 'spec/src/**/*spec.js'],
        dest: 'spec/specs.js'
      }
    },

    clean: ['libs.js', 'app.js', 'spec/specs.js', 'styles/index.css'],

    watch: {
      options: { livereload: true },
      libs: {
        files: ['lib/**/*'],
        tasks: ['browserify:libs']
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['browserify:app']
      },
      specs: {
        files: ['spec/src/**/*.js'],
        tasks: ['browserify:specs']
      },
      html: {
        files: ['index.html', 'styles/**/*.css', 'spec/index.html', 'spec/lib/*', 'spec/fixtures/*']
      },
      style: {
        files: ['styles/**/*.styl'],
        tasks: ['stylus']
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
        'libs.js',
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
