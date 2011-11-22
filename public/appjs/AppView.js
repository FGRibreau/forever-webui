App.AppView = Backbone.View.extend({
    el: $(".container"),

    events:{
      'click .refresh': 'refresh'
    },

    initialize: function(processData) {
      // Create our process collection
      this.Processes = new App.ProcessList();

      this.Processes.bind('all', this.updateAll, this);

      // Will trigger the "all" event
      this.Processes.reset(processData);

      this.$('#app-version').text(App.version);
      document.title += App.version;
    },

    addOne: function(process){
      var view = new App.ProcessView({model: process});
      this.$("#process-list").append(view.render().el);
    },

    updateAll: function() {
      this.$("#process-list").empty();
      this.Processes.each(this.addOne, this);

      this.render();
    },

    refresh: function(){
      this.Processes.fetch();
    },

    render: function() {
      this.$('#process-count').text(this.Processes.length);
    }
});