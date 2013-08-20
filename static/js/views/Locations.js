define([
  'jquery', 
  'underscore', 
  'backbone',

  'text!templates/Locations.html',
    'libs/gmaps'
  ], function($, _, Backbone, LocationsTemplate){
  var LocationView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",
    lat: "",
    lng: "",
    googleMap: null,

    // Cache the template function for a single item.
    template: _.template(LocationsTemplate),

    // The DOM events specific to an item.
    events: {
      "dblclick div.Location-content" : "edit",
      "click div.Location-content"    : "centerMap",
      "click span.Location-destroy"   : "clear",
      "keypress .Location-input"      : "updateOnEnter"
    },

    // The LocationView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Location** and a **LocationView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render', 'close');
      this.model.bind('change', this.render);
      this.model.view = this;

    },

    // Re-render the contents of the Location item.
    render: function() {

      $(this.el).html(this.template(this.model.toJSON()));
      this.setContent();
      return this;
    },

    setMap: function(googleMap) {
      this.googleMap = googleMap;
    },

    centerMap: function() {
      this.googleMap.centerMap(this.getLat(), this.getLng());
    },



    getLat: function() {

      return this.model.get('lat');
    },

    getLng: function() {
      return this.model.get('lng');
    },

    getTitle: function() {
      return this.model.get('title');
    },

    getAddress: function() {
      return this.model.get('address');
    },



    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the Location item.
    setContent: function() {
      var address = this.model.get('address');
      this.$('.Location-content').text(address);

      this.input = this.$('.Location-input');
      this.input.bind('blur', this.close);
      this.input.val(address);
      this.centerMap();

    },



    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the Location.
    close: function() {
      this.model.save({address: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }

  });
  return LocationView;
});
