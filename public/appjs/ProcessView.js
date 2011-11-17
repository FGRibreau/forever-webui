App.ProcessView = Backbone.View.extend({
  // Will contain the process view item
  tagName: "div",
  className: "row",

  // Cache the template
  tmpl: $('#process-tmpl').html(),


  // DOM Event specific to an item
  events: {
    "click .info":      "info",
    "click .restart":   "restart",
    "click .stop":      "stop"
  },

  // Le render est appelé par
  initialize: function() {
    this.model.bind('destroy', this.remove, this);
  },

  // Re-render the content of the process item
  render: function() {
    $(this.el).html(Mustache.to_html(this.tmpl, this.model.toJSON()));
    return this;
  },

  info: function(){
    this.model.info();
  },

  restart: function(){
    this.model.restart();
  },

  stop: function(){
    this.model.stop();
  },

  remove: function(){
    $(this.el).remove();
  }
});