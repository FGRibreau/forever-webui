// App.ProcessDetails = Backbone.View.extend({
//   defaults: {
//     args: null
//   },

//   url: function() {
//     return '/addProcess';
//   }
// })

App.ModalView = Backbone.View.extend({
  tmpl: $('#modal-template').html(),

  events: {
    "click .closeProcess" :   "close",
    "click .addProcess"   :   "addProcess"
  },

  initialize: function() {
    this.model = new Backbone.Model();
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    $(this.el).html(Mustache.to_html(this.tmpl, this.model.toJSON()));
    return this;
  },

  show: function() {
    $(document.body).append(this.render().el);
    $('#process-args-input').focus();
  },

  close: function() {
    this.remove();
  },

  addProcess: function(){
    if ($('#process-args-input').val()) {
      var request = $.ajax({
          url: "/addProcess",
          type: "post",
          data: {'args': encodeURIComponent($('#process-args-input').val())}
      });
      
      request.success(function (response, textStatus, jqXHR){
          var timingForRefresh = setTimeout(function() {
              $('.refresh').trigger('click');
              clearTimeout(timingForRefresh);
          }, 3000);
      });

      request.error(function (jqXHR, textStatus, errorThrown){
          console.error(
              "The following error occured: " +
              textStatus, errorThrown
          );
      });
    }; this.remove();
  }
});