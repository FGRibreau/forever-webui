// Process model
// Dependencies: prettyDate

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
        sourceDir: '',
    },

    initialize: function(process, collection) {
        this.attributes.time = prettyDate(process.ctime);
        
        // Build fetch function
        _.each(['info','stop','restart'], this._makeMethod, this);
    },

    _makeMethod: function(method){
      this[method] = function(cb){
        $.ajax('/'+method+'/'+this.get('uid'))
        .complete(function(data){
            cb(JSON.parse(data.responseText));
        });
      }
    }
});