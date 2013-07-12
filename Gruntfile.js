path = require('path');
deps = require('matchdep');

module.exports = function(grunt) {
	deps.filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['Gruntfile.js', './src/**/*.js']
		},
		watch: {
			js: {
				files: ['Gruntfile.js', './src/**/*.js'],
				tasks: ['jshint']
			}
		},
		express: {
			dev: {
				options: {
					port: 9000,
					bases: path.resolve('./src/web/public'),
					monitor: {},
					server: path.resolve('./src/web/app.js'),
					debug: true
				}
			}
		}
	});

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('server', ['express', 'express-keepalive']);
};