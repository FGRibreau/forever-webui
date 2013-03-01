module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      '  */\n',
    clean: {
      src: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      css: {
        src: ['public/css/bootstrap.1.4.0.min.css', 
              'public/css/style.css'],
        dest: 'public/dist/foreverui.min.css'
      },
      js: {
        src: ['public/appjs/Process.js', 
              'public/appjs/ProcessList.js',
              'public/appjs/ProcessView.js',
              'public/appjs/AppView.js',
              'public/appjs/ModalView.js',
              'public/appjs/AddProcess.js'],
        dest: 'public/dist/foreverui.min.js'
      },
    },
    cssmin: {
      css: {
        src: 'public/dist/foreverui.min.css',
        dest: 'public/dist/foreverui.min.css'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.js.dest %>',
        dest: 'public/dist/foreverui.min.js'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin']);
};