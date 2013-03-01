var should = require('should'),
	spawn = require('child_process').spawn;

describe('Forever Start', function(){
	var appServerProcess, processId,
		Request, appServer;
	Request = require('supertest');
	/**
	 * [@classSetup]
	 */
	before(function (done) {
		this.child = spawn("forever",
							['stopall']);
		this.child = spawn("forever", ['start',
					'./test/fixtures/testProcessRun.js']);
		appServer 			= 'http://localhost:8085';
		appServerProcess 	= spawn("node", ['app.js']);
		done();
	});
	
	/**
	 * [@classTearDown]
	 */
	after(function (done) {
		this.child = spawn("forever",
							['stopall']);
		spawn("kill", [appServerProcess.pid])
		done();
	});

	/**
	 * [@testSetup]
	 */
	beforeEach(function (done) {
		this.bail = true;
		done()
	});

	describe('Starting a Process with Forever: ', function(){
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