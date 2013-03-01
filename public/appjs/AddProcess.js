App.AddProcess = Backbone.View.extend({
  el: $("body"),

    events:{
      'click #addProcess-modal': 'showmodal',
      'click .closeProcess' :   'closemodal',
      'click .addProcess'   :   'addProcess'
    },

    initialize: function() {
      this.addProcessModal = new App.ModalView();
    },

    showmodal: function(){
      this.addProcessModal.show();
    },

    closemodal: function(){
      this.addProcessModal.close();
    },

    addProcess: function(){
      this.addProcessModal.addProcess();
    }
});