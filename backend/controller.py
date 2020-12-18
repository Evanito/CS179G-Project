import time
import random

import relational_database
import redis_database


class CS179GController:
    def __init__(self):
        print("Starting controller....")
        start = time.time()
        self.dbc = relational_database.DBImp()
        self.dbr = redis_database.RedisDatabase()
        print("Finished in %ss" % (time.time() - start))

    def search_user(self, query, count=10):
        userresults = self.dbc.get_query_in_user(query)
        results = []
        if userresults is not None:
            idlist = [entry.strip() for entry in list(userresults["USER_ID"].sort_values(ascending=False)[:count])]
            for userid in idlist:
                results.append(self.get_user_by_id(userid))
            return results
        return []

    def search_email(self, query, count=1):
        userresults = self.dbc.get_query_user_email(query)
        results = []
        if userresults is not None:
            idlist = [entry.strip() for entry in list(userresults["USER_ID"].sort_values(ascending=False)[:count])]
            for userid in idlist:
                results.append(self.get_user_by_id(userid))
            return results
        return []

    def search_tag(self, query, count=10):
        postresults = self.dbc.get_query_in_caption(query.strip("# "))
        if postresults is not None:
            return [entry.strip() for entry in list(postresults["POST_ID"].sort_values(ascending=False)[:count])]
        return []

    def get_user_by_id(self, userid):
        userdata = self.dbc.get_user_id(userid)
        if userdata is not None:
            user = {
                "name": userdata["USER_NAME"][0].strip(),
                "userid": userdata["USER_ID"][0].strip(),
                "bio": userdata["BIO"][0].strip(),
                "avatar": userdata["AVATAR"][0].strip()
            }
            return user
        else:
            return {"name": "Anonymous", "userid": "-1", "bio": "Uh oh! I'm lost!", "avatar": ""}

    def get_post(self, postid):
        postdata = self.dbc.get_post_postid(postid)
        if postdata is not None:
            likedata = self.dbc.get_like_postid(postid)
            likes = len(likedata["POST_ID"]) if likedata is not None else 0
            description = postdata["DESCRIPTION"][0].strip()
            description = "" if description == "null" else description
            post = {
                "userid": postdata["USER_ID"][0].strip(),
                "description": description,
                "postid": postdata["POST_ID"][0].strip(),
                "posted": postdata["POSTED_AT"][0].strip(),
                "likes": likes
            }
            return post
        else:
            return {"userid": "-1", "description": "", "postid": "-1", "posted": 0, "likes": 0}

    def get_user_timeline(self, userid, page=None, count=20):
        if str(userid) != "-1":
            following_list = self.dbc.get_follow_userid(userid)
            if following_list is not None:
                timelineDF = self.dbc.get_post_bulk_userid(following_list["TARGET_ID"])
            else:
                return []
        else:
            timelineDF = self.dbc.get_post_bulk()
        just_postid = timelineDF["POST_ID"].sort_values(ascending=False)
        if page is not None:
            start_index = just_postid.index(page)
            just_postid = just_postid[start_index:]
        rows = [entry.strip() for entry in list(just_postid[:count])]
        out = {
            "data": rows,
            "count": len(rows),
            "time": time.time(),
        }
        return out

    def get_popular_timeline(self, page=None, count=20):
        timelineDF = self.dbc.get_post_bulk()
        timelineDF["LIKES"] = [(len(self.dbc.get_like_postid(postid)["POST_ID"]) if self.dbc.get_like_postid(postid) is not None else 0) for postid in timelineDF["POST_ID"]]
        recent_timelineDF = timelineDF[timelineDF["POSTED_AT"].astype(float) > (time.time() - 86400)]
        just_postid = recent_timelineDF.sort_values(by=["LIKES"], ascending=False)["POST_ID"]
        if page is not None:
            start_index = just_postid.index(page)
            just_postid = just_postid[start_index:]
        rows = [entry.strip() for entry in list(just_postid[:count])]
        out = {
            "data": rows,
            "count": len(rows),
            "time": time.time(),
        }
        return out

    def get_user_feed(self, page, max_count, userid):
        rows = []
        userposts = self.dbc.get_post_userid(userid)
        if userposts is not None:
            for postnum in range(len(userposts["POST_ID"])):
                rows.append(userposts["POST_ID"][postnum].strip())
                if len(rows) >= max_count:
                    break
        return sorted(rows, reverse=True)

    def get_comments(self, postid, page, count=20):
        commentsdata = self.dbc.get_comment_postid(postid)
        if commentsdata is not None:
            comments = []
            for rownum in range(len(commentsdata["POST_ID"])):
                if rownum < page:  # skip until page starts
                    continue
                if rownum > (page + count):  # break once count reached
                    break
                commentid = commentsdata["COMMENT_ID"][rownum].strip()
                commentdata = self.dbr.getcomment(commentid)
                userdata = self.dbc.get_user_id(commentsdata["USER_ID"][rownum])
                comment = {
                    "userid": commentsdata["USER_ID"][rownum].strip(),
                    "name": userdata["USER_NAME"][0].strip(),
                    "comment": commentdata.strip()
                }
                comments.append(comment)
            return comments
        return []

    def create_post(self, userid, description, imagebytes):
        postid = self.dbr.generate_post()
        self.dbr.setimage(postid, imagebytes)
        self.dbc.add_post(userid, postid, description, str(time.time()))
        return postid

    def create_comment(self, userid, postid, comment):
        commentid = self.dbr.generate_comment()
        self.dbr.setcomment(commentid, comment)
        self.dbc.add_comment(userid, postid, commentid)
        return True

    def upsert_user(self, username, userid, firstname, lastname, bio, email, avatar):
        userdata = self.dbc.get_user_id(userid)
        if userdata is None:
            self.dbc.add_user(username, userid, firstname, lastname, bio, email, avatar)

    def get_image(self, postid):
        '''returns binary image data'''
        return self.dbr.getimage(postid)

    def upload_image(self, postid, image):
        """store image under a given postid"""
        return self.dbr.setimage(postid, image)

    def follow_user(self, userid, targetid):
        self.dbc.add_follows(userid, targetid)
        return True

    def followed_user(self, userid, targetid):
        follows = self.dbc.get_follow_userid_targetid(userid, targetid)
        return follows is not None

    def unfollow_user(self, userid, targetid):
        self.dbc.delete_follow(userid, targetid)
        return True

    def like_post(self, userid, postid):
        self.dbc.add_like(userid, postid)
        return True

    def liked_post(self, userid, postid):
        liked = self.dbc.get_like_userid_postid(userid, postid)
        return liked is not None

    def unlike_post(self, userid, postid):
        self.dbc.delete_like(userid, postid)
        return True
