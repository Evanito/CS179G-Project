from flask import Flask, jsonify, request, send_from_directory
import json
import time
import random
import os

from werkzeug.utils import secure_filename

from controller import CS179GController
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = './images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

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
    code = request.args.get('code')
    out = {
        "data": "fuck",
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/user")
def user():
    uids = request.args.get('id').split(",") if request.args.get('id') else []
    ulogins = request.args.get('login').split(",") if request.args.get('login') else []
    mock = [{"username": "dreband", "name": "dre band", "userid": "1", "bio": "hi bye", "email": "band@gmail.com"},
            {"username": "mwalsh", "name": "matt walsh", "userid": "2", "bio": "none", "email": "mwalsh@gmail.com"},
            {"username": "dreband", "name": "ronan todd", "userid": "3", "bio": "this bio is the sh******", "email": "rtodd@gmail.com"},
            {"username": "dreband", "name": "Evan Gierst", "userid": "4", "bio": "skrrrrrrrt", "email": "esgierst@gmail.com"}]
    rows = []
    for uid in uids:
        #rows.append(control.get_user_by_id(uid))
        for row in mock:
            if str(uid) == row["userid"]:
                rows.append(row)
    for ulogin in ulogins:
        #rows.append(control.get_user_by_login(ulogin))
        for row in mock:
            if str(ulogin) == row["username"]:
                rows.append(row)
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/image/<id>")
def image(id):
    filename = random.choice(["smile.png", "stare.png"])
    return send_from_directory('images', filename, mimetype='image/png', attachment_filename="image.png")


@app.route("/upload", methods=["POST"])
def upload():
    id = 420
    if 'file' not in request.files:
        return "no file part"
    file = request.files['file']
    if file.filename == '':
        return 'No image selected for uploading'
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], str(id)))
        # print('upload_image filename: ' + filename)
        # flash('Image successfully uploaded and displayed')
        # return render_template('upload.html', filename=filename)
        return jsonify({"post_id": id})
    else:
        return 'Allowed image types are -> png, jpg, jpeg, gif'


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/post/<id>")
def post(id):
    """
    returns description, user, reactions
    :return:
    """
    mock = [{"userid": "4", "description": "selfie at the beach", "postid": id},
            {"userid": "3", "description": "greg stole my phone!", "postid": id},
            {"userid": "2", "description": "#gamer", "postid": id},
            {"userid": "4", "description": "just put up my christmas tree!", "postid": id}]
    rows = mock[int(id)-1]
    out = {
        "data": rows,
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/delete/<id>")
def delete(id):
    return "not mocked yet lol"


@app.route("/timeline")
def global_timeline():
    page = int(request.args.get('page')) if request.args.get('page') else 0
    count = int(request.args.get('count')) if request.args.get('count') else 20
    mock = ["1", "2", "3", "4"]
    rows = mock[page:(count + page)]
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/timeline/<id>")
def timeline(id):
    page = int(request.args.get('page')) if request.args.get('page') else 0
    count = int(request.args.get('count')) if request.args.get('count') else 20
    mock = ["1", "2", "3", "4"]
    rows = mock[page:(count + page)]
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/comments/<id>")
def comments(id):
    rows = []
    out = {
        "data": rows,
        "count": len(rows),
        "time": time.time(),
    }
    return jsonify(out)


@app.route("/comment", methods=["POST"])
def comment():
    return "not mocked yet lol"


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
            app.run(host='0.0.0.0', port="14200")
        except Exception:
            if debug:
                raise

