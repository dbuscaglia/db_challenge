/**
 * file: views/app.js
 * author: dbuscaglia
 * sponsor: uber code challenge
 * 
 * this is the main application UI view.  It has two children views: map and location.
 * this view handles the business logic of creation of a new favorite location into the location collection 
 */

define([
  'jquery',
  'underscore', 
  'backbone',
  'collections/Locations',
  'views/Locations',
  'views/map',

  ], function($, _, Backbone, Locations, LocationView, MapView){
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#Locationapp"),
    googleMap: null,


    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "click #geocoding_btn": "createOnEnter"
    },

    // At initialization we bind to the relevant events on the `Locations`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting Locations that might be saved in *localStorage*.
    initialize: function() {
      
      // construct our google maps view and keep a reference to it
      var mapView = new MapView();
      mapView.render();
      this.googleMap = mapView;

      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input    = this.$("#new-Location");

      Locations.bind('add',     this.addOne);
      Locations.bind('reset',   this.addAll);
      Locations.bind('all',     this.render);

      Locations.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      // no op

    },

    // Add a single Location item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(Location) {

      var view = new LocationView({model: Location});
      view.setMap(this.googleMap);
      this.$("#Location-list").append(view.render().el);

      this.googleMap.addMarker(view.getLat(), view.getLng(), view.getTitle());
      this.googleMap.centerMap(view.getLat(), view.getLng());
    },

    // Add all items in the **Locations** collection at once.
    addAll: function() {
      Locations.each(this.addOne);
    },

    // Generate the attributes for a new Location item.
    newAttributes: function() {
      return {
        address: this.input.val(),
        order:   Locations.nextOrder(),
        lat: 38.7952807,
        lng: 121.43339700000001,
        title: "test"
      };
    },

    // If you hit return in the main input field, create new **Location** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {

        GMaps.geocode({
            address: $('#new-Location').val().trim(),
            callback: function(results, status){
              if(status=='OK'){
                result = results[0].geometry.location;
                if (result) {
                      var attribs = {
                          address: $('#new-Location').val().trim(),
                          lat: result.lat(),
                          lng: result.lng(),
                          title: $('#name').val().trim(),
                          id:   Locations.nextOrder()
                        };
                      Locations.create(attribs);
                      $('#new-Location').val('');
                      $('#name').val('');
                }
              }
            } 

          });
      
      return false;
    },


    // Lazily show the tooltip that tells you to press `enter` to save
    // a new Location item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) { 
        clearTimeout(this.tooltipTimeout);
      }
      if (val == '' || val == this.input.attr('placeholder')) {
        return;
      } 
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    }

  });
  return AppView;
});
