App.ProcessList = Backbone.Collection.extend({
    model: App.Process,

    url: '/processes',

    comparator: function(process) {
      return process.get('file');
    },

    getByPID: function(pid) {
      // this.detect == find
      return this.detect(function(process) {
          return process.get('pid') == pid;
      });
    }
});