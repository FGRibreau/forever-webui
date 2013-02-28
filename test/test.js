var should = require('should'),
	spawn = require('child_process').spawn;

describe('Forever Start', function(){
	beforeEach(function (done) {
		this.child = spawn("forever", ['./test/fixtures/testProcessRun.js']);
		this.bail = true;
		done()
	});

	afterEach(function (done) {
		this.child = spawn("forever", ['stop 0']);
		done();
	})

	describe('Starting a Process w/ Forever: ', function(){
		var app, processId, Request, appServer;
		app 		= require('../app').app
		Request 	= require('supertest');
		appServer 	= 'http://localhost:8085';
		
		it('should display it in webUI', function(done){
			this.timeout(5000);
			setTimeout(function () {
				var request = Request(appServer);
				request
					.get('/processes')
					.expect(200)
					.end(function (err, res) {
						processId = JSON.parse(res.text)[0].uid;
				  		JSON.parse(res.text)[0].should.include({
			  				file: 'test/fixtures/testProcessRun.js'
			  			});
			  			done();
					});
			}, 2000);
		});

		it('should stop after stopped from webUI', function(done){
			this.timeout(5000);
			setTimeout(function () {
				var request = Request(appServer);
				request
					.get('/stop/' + processId)
					.expect(200)
					.end(function (err, res) {
				  		JSON.parse(res.text).should.include({
			  				status: 'success',
			  				details: true
			  			});
			  			done();
					});
			}, 2000);
		});
	});
});