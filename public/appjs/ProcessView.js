App.ProcessView = Backbone.View.extend({
  // Will contain the process view item
  tagName: "div",
  className: "row",

  // Cache the template
  tmpl: $('#process-tmpl').html(),

  tmplInfo: $('#tplInfo'),


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

  info: function(e){
    if(e){
      e.preventDefault()
    }

    var $row = $(this.el);

    $row.addClass('load');

    // Get process info
    this.model.info(function(infos){

      // Show process info
      this._showInfo($row, infos);

      $row.removeClass('load');

    }.bind(this));
  },

  restart: function(e){
    if(e){
      e.preventDefault()
    }

    var $row = $(this.el);

    $row.addClass('load');

    this.model.restart(function(result){
      $row.removeClass('load');
      _.delay(this.model.collection.fetch.bind(this.model.collection), 1000);
    }.bind(this));
  },

  stop: function(e){
    if(e){
      e.preventDefault()
    }

    var $row = $(this.el);

    $row.addClass('load');

    this.model.stop(function(result){
      $row.removeClass('load');
      _.delay(this.model.collection.fetch.bind(this.model.collection), 1000);
    }.bind(this));

  },

  remove: function(){
    $(this.el).remove();
  },

  // Helpers

  _formatInfo: function(results){

    if(results.status == 'error'){
      return $('<strong>'+results.details+'</strong>');
    }

    var $div = $('<div/>');

    results.details.forEach(function(log){
      var formatterLog = '';
      $div.append(log[0]);
      for (var i=0, end=log[1].length; i<end; i++) {
        formatterLog += "<span class='ansi-"+log[1][i].foreground+"'>"+log[1][i].text+"</span>";
      }      
      $div.append('<pre class="prettyprint">'+formatterLog+'</pre>');
    });

    return $div;
  },

  _showInfo: function($row, results){
    // Add
    var $next = $row.next();

    if($next.length == 0 || $next.is('.row')){
      $next = this.tmplInfo
        .clone()
        .removeClass('hidden')
        .insertAfter($row)
        .alert();
    }
    
    if(results.status == 'error'){
      $next.removeClass('info').addClass('error');
    }

    $next
      .find('.alert-message-content')
        .html(this._formatInfo(results))
        .find('pre')
          .each(function(){
            this.scrollTop=900000;
          });
  }
});