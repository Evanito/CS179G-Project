from flask import Flask, jsonify, request, send_from_directory, make_response
import json
import time
import random
import os
import io
import functools

import google.auth
import google.oauth2.credentials
from flask.helpers import send_file
from google.oauth2 import id_token
import google.auth.transport.requests
import cachecontrol
import requests


from controller import CS179GController
app = Flask(__name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
CLIENT_ID = "820186523469-4hhhse7jujgedn0rnood11turbppur5u.apps.googleusercontent.com"
CLIENT_SECRET = "CRbeElS_QnzKbcrFcLFKZRZn"

# https://googleapis.dev/python/google-auth/latest/reference/google.oauth2.id_token.html
session = requests.session()
cached_session = cachecontrol.CacheControl(session)
token_requests = google.auth.transport.requests.Request(session=cached_session)


def validate_bearer(request):
    #print(request.headers)
    bearer_token = request.headers.get("Authorization")
    if bearer_token is None:
        return None
    try:
        token = bearer_token[len("Bearer "):]
        idinfo = id_token.verify_oauth2_token(token, token_requests, CLIENT_ID)
        control.upsert_user(idinfo["name"], idinfo["sub"], idinfo["given_name"], idinfo["family_name"],
                            "", idinfo["email"], idinfo["picture"])
    except ValueError:
        return False
    print(idinfo)
    return idinfo


@app.route('/')
@app.route('/index')
def index():
    return "dab dab dab"
    # if google_auth.is_logged_in():
    #     user_info = google_auth.get_user_info()
    #     return '<div>You are currently logged in as ' + user_info['given_name'] + '<div><pre>' + json.dumps(user_info, indent=4) + "</pre>"

    # return 'You are not currently logged in. <a href="/google/login">login here</a>'


@app.route("/status")
def status():
    app.count += 1
    print("Current count is %s" % app.count)
    return jsonify({
        "message": "Status is good!",
        "time": time.time(),
        "count": app.count
    })


@app.route("/authenticate", methods=["POST"])
def authenticate():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    out = {
        "data": userdata["sub"],
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/user")
def user():
    uids = request.args.get('id').split(",") if request.args.get('id') else []
    rows = []
    for uid in uids:
        rows.append(control.get_user_by_id(uid))
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/image/<postid>")
def image(postid):
    image_binary = control.get_image(postid)
    return send_file(
        io.BytesIO(image_binary),
        mimetype='image/png')


@app.route("/download/<postid>")
def download(postid):
    image_binary = control.get_image(postid)
    return send_file(
        io.BytesIO(image_binary),
        as_attachment=True,
        mimetype='image/png',
        attachment_filename="image-%s.png" % postid)


@app.route("/upload", methods=["POST"])
def upload():
    # check user
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    userid = userdata["sub"]
    description = request.form["caption"]
    if description is None or len(description) > 500:
        description = ""
    # check file
    if 'file' not in request.files:
        return "no file part"
    file = request.files['file']
    if file.filename == '':
        return 'No image selected for uploading'
    if file and allowed_file(file.filename):
        imagebytes = file.read()
        postid = control.create_post(userid=userid, description=description, imagebytes=imagebytes)
        return jsonify({
            "postid": postid
        })
    else:
        return 'Allowed image types are -> png, jpg, jpeg, gif'


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/post/<postid>")
def post(postid):
    """
    returns description, user, reactions
    :return:
    """
    rows = control.get_post(postid)
    out = {
        "data": rows,
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/delete/<postid>")
def delete(postid):
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    out = {
        "success": True,
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/explore")
def global_timeline():
    page = request.args.get('page') if request.args.get('page') else None
    count = int(request.args.get('count')) if request.args.get('count') else 20
    out = control.get_user_timeline(-1, page, count)
    return jsonify(out)


@app.route("/timeline")
def timeline():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    userid = userdata["sub"]
    page = request.args.get('page') if request.args.get('page') else None
    count = int(request.args.get('count')) if request.args.get('count') else 20
    out = control.get_user_timeline(userid, page, count)
    return jsonify(out)


@app.route("/comments/<postid>")
def comments(postid):
    rows = control.get_comments(postid, page=0, count=20)
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/comment", methods=["POST"])
def comment():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    userid = userdata["sub"]
    commentstr = request.form["data"]
    postid = request.form["postid"]
    if commentstr is None or postid is None or len(commentstr) < 2 or len(commentstr) > 500:
        success = False
    else:
        success = control.create_comment(userid, postid, commentstr)
    out = {
        "success": success,
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/follow", methods=["POST"])
def follow():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    targetid = request.args.get("targetid")
    out = {
        "success": control.follow_user(userdata["sub"], targetid),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/unfollow", methods=["POST"])
def unfollow():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    targetid = request.args.get("targetid")
    out = {
        "success": control.unfollow_user(userdata["sub"], targetid),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/like", methods=["POST"])
def like():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    postid = request.args.get("postid")
    out = {
        "success": control.like_post(userdata["sub"], postid),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/unlike", methods=["POST"])
def unlike():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    postid = request.args.get("postid")
    out = {
        "success": control.unlike_post(userdata["sub"], postid),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/liked")
def liked():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    postid = request.args.get("postid")
    out = {
        "liked": control.liked_post(userdata["sub"], postid),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/followed")
def followed():
    userdata = validate_bearer(request)
    if userdata is None:
        return "no auth", 401
    elif not userdata:
        return "bad auth", 401
    postid = request.args.get("targetid")
    out = {
        "followed": control.followed_user(userdata["sub"], postid),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/userfeed/<userid>")
def userfeed(userid):
    page = request.args.get('page') if request.args.get('page') else None
    count = int(request.args.get('count')) if request.args.get('count') else 20
    rows = control.get_user_feed(page, count, userid)
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/search/user/<username>")
def search_user(name):
    rows = control.search_user(name)
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/search/tag/<hashtag>")
def search_tag(hashtag):
    rows = control.search_tag(hashtag)
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.after_request  # cors headers
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    return response


if __name__ == '__main__':
    debug = True
    while True:
        try:
            control = CS179GController()
            app.count = 0
            app.run(host='0.0.0.0', port="14200")
        except Exception:
            if debug:
                raise

