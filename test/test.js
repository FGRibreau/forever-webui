var should = require('should'),
    spawn = require('child_process').spawn;

describe('Forever Start', function () {
    var processId, appServer;
    appServer = require('../app');
    /**
     * [@classSetup]
     */
    before(function (done) {
        this.child = spawn("forever", ['stopall']);
        this.child = spawn("forever", ['start',
            './test/fixtures/testProcessRun.js']);
        done();
    });

    /**
     * [@classTearDown]
     */
    after(function (done) {
        this.child = spawn("forever", ['stopall']);
        done();
    });

    /**
     * [@testSetup]
     */
    beforeEach(function () {
        this.bail = true;
    });

    describe('Starting a Process with Forever: ', function () {
        it('should display it in webUI', function (done) {
            this.timeout(5000);
            setTimeout(function () {
                appServer.forever.list("", function (err, results) {
                    processId = JSON.parse(JSON.stringify(results))[0].uid;
                    JSON.parse(JSON.stringify(results))[0].should.include({
                        file: 'test/fixtures/testProcessRun.js'
                    });
                    done();
                });
            }, 1500);
        });

        it('should stop after stopped from webUI', function (done) {
            this.timeout(5000);
            setTimeout(function () {
                appServer.UI.stop(processId, function (err, results) {
                    JSON.parse(JSON.stringify({
                        status: 'success',
                        details: results
                    })).should.include({
                        status: 'success',
                        details: true
                    });
                    done();
                });
            }, 1500);
        });
    });
});