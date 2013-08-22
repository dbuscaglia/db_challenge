Hi Uber!
========

<b>I love UBER.</b>  Look up my account (danbuscaglia@gmail.com) and you will see!!!

This is the first flask / backbone app I have ever made.  However, I have enjoyed it immensely and have confidence in the design patterns used in this code.

Client:
-------
I have employed modular backbone with require.js.  After doing extensive research, this appeared to be the best MV* framework.

The static folder contains:
index.html
js
css

The javascript files are broken into a clean MV* framework.  Each favorite location is in a Locations collection.  Each location has a view and a model describing its attributes.  Furthremore, the view has a template describing the particular details of the location instance.

I have taken the time to implement autocomplete to improve the UI.  I have been very busy and made this exercise as simple and quick as possible.

Server:
-------
I have opted to go with a simple rest API trusting smart client and a nosql json document store "rethinkDB."

I have chosen this for a few reasons:
1) security is not an issue for a simple code challenge
2) auth is not needed for a simple code challenge (I understand the importance of this however.)
3) this is a simple code challenge

Testing:
--------
If I was going to release this into a test environment, I would test with Jasmine (http://pivotal.github.io/jasmine/) for the client
and take advantage of flasks built in unit testing.  (http://flask.pocoo.org/docs/testing/)  Please excuse the lack of unit testing here, I have many interviews and this is a time consuming exercise in and of itself.

Deployment:
-----------
R.js and grunt would help efficiently deploy this to a production environment.  (https://github.com/gruntjs/grunt-contrib-requirejs) by minifying and making everything one file.  Alternately, if we wanted to use 3rd party CDNs, we could use shims.  Hudson would be a great tool for automating the deployment process, although for a webservice this simple, a simple build script would do.  EC2/heroku or a custom cage, this solution is fine.

Scale:
======
RethinkDB has impressive blackbox scaling ability.  However, I would not use this for a production scale environment.  Neither would I use mongoDB, as it has issues when its sharding scheme does not work as well as mongo enthusiasts have said.  Couchbase (formerly membase) [http://www.couchbase.com/] is a very proven blackbox cache/persistence store - and works extremely well.  It employs the common share-nothing nosql approach, and has scaled extremely well at high update / write intensive environments.  It also has great LRU abilities to "tombstone" inactive records out of the in memory cache - and works extremely well - reducing server costs.

Notes:
------
I LOVE uber.  I really want to work for you guys.  I hope you guys bring me onsite.

Cheers
-DB



 
