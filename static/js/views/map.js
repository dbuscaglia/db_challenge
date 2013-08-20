// Filename: map.js
// @author: dbuscaglia
// @sponsor: Uber Code Challenge

// this view/controller hybrid will take the gmaps alias defined in the main.js and
// attatch it to the desired division in the map template.  It takes a collection of
// locations and transforms them into "markers" on the map

// aliaces we need for this view
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

      

      $(function(){
        

        
        $("#new-Location").geocomplete()
          .bind("geocode:result", function(event, result){
            console.log("Dan B :: got geocode results");
            return false;
          })
          .bind("geocode:error", function(event, status){
            console.log("ERROR: " + status);
          })
          .bind("geocode:multiple", function(event, results){
            console.log("Multiple: " + results.length + " results found");
          });
        
        $("#find").click(function(){
          $("#new-Location").trigger("geocode");
        });
        
        $("#examples a").click(function(){
          $("#new-Location").val($(this).text()).trigger("geocode");

          return false;
        });
        
      });


    }

  });
  return MapView;

});