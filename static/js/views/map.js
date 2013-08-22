// Filename: map.js
// @author: dbuscaglia
// @sponsor: Uber Code Challenge

// this view/controller hybrid will take the gmaps alias defined in the main.js and
// attatch it to the desired division in the map template.  It takes a collection of
// locations and transforms them into "markers" on the map


/**
 * file: views/location.js
 * author: dbuscaglia
 * sponsor: uber code challenge
 * 
 * this the view for the google map
 * this view handles the business logic of centering, placing markers and attatching geolocation
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'libs/gmaps',
], function($, _, Backbone){

  var MapView = Backbone.View.extend({
    

    el: $(".page"),
    map: null,

    addMarker: function(latp, lngp, title) {

      this.map.addMarker({
      lat: latp,
      lng: lngp,
      title: title,
      click: function(e) {
        alert('You clicked in this marker');
      }

      
    });
    },

    centerMap: function(latp, lngp) {
      this.map.setCenter(latp, lngp);
    },

    render: function(){

      var map = new GMaps({
        div: '#mapCanvas',
        lat: 38.7952807,
        lng: 121.43339700000001
      });

      this.map = map;

      $("#new-Location").geocomplete()
          .bind("geocode:result", function(event, result){
            return false;
          });

        
    


    }

  });
  return MapView;

});