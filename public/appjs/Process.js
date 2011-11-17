// Process model
App.Process = Backbone.Model.extend({
    defaults: {
        uid: '',
        ctime: 0,
        command: '',
        pid: 0,
        foreverPid: 0,
        logFile: '',
        options: [],
        file: '',
        pidFile: '',
        outFile: '',
        errFile: '',
        sourceDir: ''
    },

    initialize: function() {
    },

    // Get process info
    info: function() {
      console.log('INFO');
    },

    // Stop a process
    stop: function() {
      console.log('STOP');
    },

    // Restart a process
    restart: function() {
      console.log('RESTART');
    }
});