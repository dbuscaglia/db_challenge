# Filename: server.py
# Author: dbuscaglia
# Sponsor: Uber Code Challenge
# 
# Simple Flask / nosql restAPI (using rethinkDB for pure JSON binding)

import argparse
import json
import os

from flask import Flask, g, jsonify, render_template, request, abort, url_for, redirect

import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

#### Connection details

# SERVER SETTINGS
RDB_HOST =  os.environ.get('RDB_HOST') or 'localhost'
RDB_PORT = os.environ.get('RDB_PORT') or 28015
LOCATION_DB = 'locationapp'

#### Setting up the app database

#  set up DB
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

# POST NEW LOCATION
@app.route("/locations", methods=['POST'])
def new_location():
    inserted = r.table('locations').insert(request.json).run(g.rdb_conn)
    return jsonify(id=inserted['generated_keys'][0])


#### Retrieving a single location

# GET LOCATION BY ID
@app.route("/locations/<string:location_id>", methods=['GET'])
def get_location(location_id):
    location = r.table('locations').get(location_id).run(g.rdb_conn)
    return json.dumps(location)

#### Editing/Updating

#UPDATE BY ID
@app.route("/locations/<string:location_id>", methods=['PUT'])
def update_location(location_id):
    return jsonify(r.table('locations').get(location_id).replace(request.json).run(g.rdb_conn))

#PATCH BY ID
@app.route("/locations/<string:location_id>", methods=['PATCH'])
def patch_location(location_id):
    return jsonify(r.table('locations').get(location_id).update(request.json).run(g.rdb_conn))


#### Deleting

# DELETE BY ID
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
