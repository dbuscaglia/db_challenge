import argparse
import json
import os

from flask import Flask, g, jsonify, render_template, request, abort, url_for, redirect

app = Flask(__name__, static_url_path='')
app.config.from_object(__name__)

@app.route("/")
def root():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run the Flask location app')
    parser.add_argument('--setup', dest='run_setup', action='store_true')

    args = parser.parse_args()
    if args.run_setup:
        app.run(debug=True)
    else:
        app.run(debug=True)
