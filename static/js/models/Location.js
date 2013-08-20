define(['underscore', 'backbone'], function(_, Backbone) {
  var LocationModel = Backbone.Model.extend({

    // Default attributes for the Location.
    defaults: {
      address: "2656 Webster St. San Francisco, CA 94123",
      lat: 0,
      lng: 0,
      title: "default"
    },

    // Ensure that each Location created has `content`.
    initialize: function() {

      console.log("Dan B:: test");
      if (!this.get("address")) {
        this.set({"address": this.defaults.address});
      }
    },

    // Remove this Location from *localStorage* and delete its view.
    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });
  return LocationModel;
});
