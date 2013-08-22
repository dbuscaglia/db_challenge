define([
  'underscore', 
  'backbone',
 'storage',  
  'models/Location'
  ], function(_, Backbone, Store, Location){
	  
	var LocationsCollection = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Location,

    // Save all of the Location items under the `"Locations"` namespace.
   localStorage: new Store("Locations"),
   url: '/locations',


    // We keep the Locations in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) {
        console.log("Got a bad order");
        return 1;
      } else {
        console.log(" Current order + 1: " + this.last().get('id') + 1);
        return this.last().get('id') + 1;
      }
    },


    // Locations are sorted by their original insertion order.
    comparator: function(Location) {
      return Location.get('id');
    }

  });
  return new LocationsCollection;
});
