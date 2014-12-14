'use strict';

var CLI = {

	init: function(argv, app) {

		if(argv.help || argv.h || argv._.length === 0) {
			CLI.askForHelp(argv._);
			return true;
		}

		var command = argv._[0],
			cliPort = argv.port || argv.p;

		if(command === 'start') {
			CLI.start(app, cliPort);
		} else if(command === 'stop') {
			CLI.stop();
		} else {
			CLI.askForHelp(argv._);
			return true;
		}

	},

	cliHelp: function(command) {
		var fs = require('fs'),
			path = require('path'),
			filePath = [ 'help', command, 'txt' ].join('.'),
			basePath = path.join(__dirname, '..', 'utils'),
			data;

		filePath = path.join(basePath, filePath);

		if(!fs.existsSync(filePath)) {
			CLI.cliHelp('cli');
			return;
		}

		data = fs.readFileSync(filePath, 'utf-8');
		console.log(data + '\n');

	},

	askForHelp: function(commandArray) {
		if(commandArray.length === 0) {
			CLI.cliHelp('cli');
			return;
		}

		CLI.cliHelp(commandArray[0]);
		return;
	},

	stop: function(app) {

		if(!CLI.server) {
			console.log('Server is closed');
			return true;
		}

		var server = CLI.server,
			process = require('process');

		process.on( 'SIGTERM', function () {
		   server.close(function () {
		     console.log( "Closed out remaining connections.");
		   });

		   setTimeout( function () {
		     console.error("Could not close connections in time, forcefully shutting down");
		     process.exit(1);
		   }, 30*1000);

		});

	},

	start: function(app, port) {

		if(!port) {
			port = 8085;
		}

		CLI.server = app.listen(port);
		console.log("Started: Forever web Console");
		console.log("Server listening on Port: " + port);
	}

};

module.exports = Object.create(CLI);