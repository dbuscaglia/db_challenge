define([
  'underscore', 
  'backbone',  
  'models/Location'
  ], function(_, Backbone, Store, Location){
	  
	var LocationsCollection = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Location,

    // Save all of the Location items under the `"Locations"` namespace.
   // localStorage: new Store("Locations"),
        url: '/locations',


    // Filter down the list to only Location items that are still not finished.
    remaining: function() {
      return this;
    },

    // We keep the Locations in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },


    // Locations are sorted by their original insertion order.
    comparator: function(Location) {
      return Location.get('order');
    }

  });
  return new LocationsCollection;
});
