import redis
import json
import io


class RedisDatabase:
    def __init__(self):
        self.redis_db = redis.Redis()
        pong = self.redis_db.ping()
        if pong:
            print("Connected to Redis!")
        else:
            raise Exception("Redis server not running!")
        with open("images/pp.png", "rb") as f:
            self.sample_image = f.read()

    def get(self, key):
        try:
            out = self.redis_db.get(str(key))
            if out is None:
                return None
            return json.loads(out)
        except KeyError:
            return None

    def __getitem__(self, key):  # overloads [] for getting items from db
        return self.get(key)

    def set(self, key, value):
        jsonify = json.dumps(value)
        self.redis_db.set(str(key), jsonify)

    def __setitem__(self, key, value):  # overloads assignment through []
        self.set(key, value)

    def delete(self, key):
        self.redis_db.delete(str(key))

    def __delitem__(self, key):  # overloads del command
        self.delete(key)

    def setimage(self, key, image):
        """takes bytesio object, converts to string and stores"""
        imagekey = "image-%s" % key
        imagestr = image.decode("ISO-8859-1")
        self.set(imagekey, imagestr)

    def getimage(self, key):
        """takes string, converts to bytesio object and returns"""
        imagekey = "image-%s" % key
        imagestr = self.get(imagekey)
        if imagestr is None:
            return self.sample_image
        return imagestr.encode("ISO-8859-1")

    def delimage(self, key):
        """deletes image with given postid"""
        imagekey = "image-%s" % key
        self.delete(imagekey)

    def generate_post(self):
        postid = self.redis_db.incr("post-counter")
        print("new post: %s" % postid)
        return postid

    def generate_comment(self):
        commentid = self.redis_db.incr("comment-counter")
        print("new comment: %s" % commentid)
        return commentid

    def setcomment(self, key, comment):
        """saves comment to given key"""
        ckey = "comment-%s" % key
        self.set(ckey, comment)

    def getcomment(self, key):
        """fetches and returns comment with given key"""
        ckey = "comment-%s" % key
        commentstr = self.get(ckey)
        return commentstr

    def delcomment(self, key):
        """deletes comment with given commentid"""
        ckey = "comment-%s" % key
        self.delete(ckey)
