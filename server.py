# A demo web application in the spirit of
# [LocationMVC](http://addyosmani.github.com/locationmvc/) showing how to use
# **RethinkDB as a backend for Flask and Backbone.js applications**.
#
# For details about the complete stack, installation, and running the
# app see the
# [README](https://github.com/rethinkdb/rethinkdb-example-flask-backbone-location).
import argparse
import json
import os

from flask import Flask, g, jsonify, render_template, request, abort, url_for, redirect

import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

#### Connection details

# We will use these settings later in the code to connect to the
# RethinkDB server.
RDB_HOST =  os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
LOCATION_DB = 'locationapp'

#### Setting up the app database

# The app will use a table `locations` in the database specified by the
# `LOCATION_DB` variable.  We'll create the database and table here using
# [`db_create`](http://www.rethinkdb.com/api/#py:manipulating_databases-db_create)
# and
# [`table_create`](http://www.rethinkdb.com/api/#py:manipulating_tables-table_create) commands.
def dbSetup():
    connection = r.connect(host=RDB_HOST, port=RDB_PORT)
    try:
        r.db_create(LOCATION_DB).run(connection)
        r.db(LOCATION_DB).table_create('locations').run(connection)
        print 'Database setup completed. Now run the app without --setup.'
    except RqlRuntimeError:
        print 'App database already exists. Run the app without --setup.'
    finally:
        connection.close()


app = Flask(__name__, static_url_path='')
app.config.from_object(__name__)

#### Managing connections

# The pattern we're using for managing database connections is to have **a connection per request**. 
# We're using Flask's `@app.before_request` and `@app.teardown_request` for 
# [opening a database connection](http://www.rethinkdb.com/api/#py:accessing_rql-connect) and 
# [closing it](http://www.rethinkdb.com/api/#py:accessing_rql-close) respectively.
@app.before_request
def before_request():
    try:
        g.rdb_conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=LOCATION_DB)
    except RqlDriverError:
        abort(503, "No database connection could be established.")

@app.teardown_request
def teardown_request(exception):
    try:
        g.rdb_conn.close()
    except AttributeError:
        pass


#list all saved locations
@app.route("/locations", methods=['GET'])
def get_locations():
    selection = list(r.table('locations').run(g.rdb_conn))
    return json.dumps(selection)

#### Creating a Location

# We will create a new location in response to a POST request to `/locations`
# with a JSON payload using
# [`table.insert`](http://www.rethinkdb.com/api/#py:writing_data-insert).
#
# The `insert` operation returns a single object specifying the number
# of successfully created objects and their corresponding IDs:
# `{ "inserted": 1, "errors": 0, "generated_keys": ["773666ac-841a-44dc-97b7-b6f3931e9b9f"] }`
@app.route("/locations", methods=['POST'])
def new_location():
    inserted = r.table('locations').insert(request.json).run(g.rdb_conn)
    return jsonify(id=inserted['generated_keys'][0])


#### Retrieving a single location

# Every new task gets assigned a unique ID. The browser can retrieve
# a specific task by GETing `/locations/<location_id>`. To query the database
# for a single document by its ID, we use the
# [`get`](http://www.rethinkdb.com/api/#py:selecting_data-get)
# command.
#
# Using a task's ID will prove more useful when we decide to update
# it, mark it completed, or delete it.
@app.route("/locations/<string:location_id>", methods=['GET'])
def get_location(location_id):
    location = r.table('locations').get(location_id).run(g.rdb_conn)
    return json.dumps(location)

#### Editing/Updating a task

# Updating a location (editing it or marking it completed) is performed on
# a `PUT` request.  To save the updated location we'll do a
# [`replace`](http://www.rethinkdb.com/api/#py:writing_data-replace).
@app.route("/locations/<string:location_id>", methods=['PUT'])
def update_location(location_id):
    return jsonify(r.table('locations').get(location_id).replace(request.json).run(g.rdb_conn))

# If you'd like the update operation to happen as the result of a
# `PATCH` request (carrying only the updated fields), you can use the
# [`update`](http://www.rethinkdb.com/api/#py:writing_data-update)
# command, which will merge the JSON object stored in the database
# with the new one.
@app.route("/locations/<string:location_id>", methods=['PATCH'])
def patch_location(location_id):
    return jsonify(r.table('locations').get(location_id).update(request.json).run(g.rdb_conn))


#### Deleting a task

# To delete a location item we'll call a
# [`delete`](http://www.rethinkdb.com/api/#py:writing_data-delete)
# command on a `DELETE /locations/<location_id>` request.
@app.route("/locations/<string:location_id>", methods=['DELETE'])
def delete_location(location_id):
    return jsonify(r.table('locations').get(location_id).delete().run(g.rdb_conn))

@app.route("/")
def root():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run the Flask location app')
    parser.add_argument('--setup', dest='run_setup', action='store_true')

    args = parser.parse_args()
    if args.run_setup:
        dbSetup()
    else:
        app.run(debug=True)


# ### Best practices ###
#
# #### Managing connections: a connection per request ####
#
# The RethinkDB server doesn't use a thread-per-connnection approach
# so opening connections per request will not slow down your database.
# 
# #### Fetching multiple rows: batched iterators ####
#
# When fetching multiple rows from a table, RethinkDB returns a
# batched iterator initially containing a subset of the complete
# result. Once the end of the current batch is reached, a new batch is
# automatically retrieved from the server. From a coding point of view
# this is transparent:
#   
#     for result in r.table('locations').run(g.rdb_conn):
#         print result
#     
#    
# #### `replace` vs `update` ####
#
# Both `replace` and `update` operations can be used to modify one or
# multiple rows. Their behavior is different:
#    
# *   `replace` will completely replace the existing rows with new values
# *   `update` will merge existing rows with the new values


#
# Licensed under the MIT license: <http://opensource.org/licenses/mit-license.php>
#
# Copyright (c) 2012 RethinkDB
#
