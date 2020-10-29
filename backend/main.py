from flask import Flask, jsonify, request
import json
import time
from controller import CS179GController
app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return 'Hello, World!\n'


@app.route("/status")
def status():
    app.count += 1
    print("Current count is %s" % app.count)
    return jsonify({
        "message": "Status is good!",
        "time": time.time(),
        "count": app.count
    })


@app.route("/authenticate")
def authenticate():
    query = request.args.get('q')
    mode = request.args.get('m')
    max_amt = 20
    rows = control.search(mode=mode, query=query, amount=max_amt)
    out = {
        "query": query,
        "mode": mode,
        "rows": rows,
        "time": time.time(),
    }
    return jsonify(out)


# @app.route("user")
# @app.route("timeline")
# @ 

@app.after_request  # cors headers
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == '__main__':
    debug = True
    while True:
        try:
            control = CS179GController()
            app.count = 0
            app.run(host='0.0.0.0', port="14242")
        except Exception:
            if debug:
                raise

