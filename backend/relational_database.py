from pyspark import SparkContext, SparkConf, SQLContext
import pyodbc
import pandas as pd


class DBImp:
    def __init__(self):
        appName = "InstantCam PySpark ODBCC"
        master = "local"
        conf = SparkConf() \
            .setAppName(appName) \
            .setMaster(master)
        sc = SparkContext(conf=conf)
        sqlContext = SQLContext(sc)
        self.spark = sqlContext.sparkSession
        database = "InstantCam"
        # if you wanna check your drivers...
        # pyodbc.drivers()
        # CONNECTION
        self.connect_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=localhost,1433;DATABASE={database};Trusted_Connection=yes;'
        # UID={user};PWD={password}'
        # "driver={SQL SERVER}; server=GTLPF1MZF5M/IZZY_SQL_001;databases=InstantCam;"

        # make a connection
        self.connection = pyodbc.connect(self.connect_str)

    def get_user_email(self, email):
        query = f'SELECT * FROM dbo."USER" WHERE (EMAIL= {email})'
        result = self.do_query(query)
        return result

    def get_user_id(self, user_id):
        query = f'SELECT * FROM dbo."USERS" WHERE (USER_ID = {user_id})'
        result = self.do_query(query)
        return result

    def get_query_in_user(self, username):
        query = f"SELECT * FROM dbo.\"USERS\" WHERE USER_NAME LIKE '%{username}%'"
        result = self.do_query(query)
        return result

    def delete_user_id(self, userid):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute(f'DELETE FROM dbo."FOLLOWS" WHERE (USER_ID= {userid})')
        cursor.execute(f'DELETE FROM dbo."FOLLOWS" WHERE (TARGET_ID= {userid})')
        cursor.execute(f'DELETE FROM dbo."LIKES" WHERE (USER_ID= {userid})')
        cursor.execute(f'DELETE FROM dbo."COMMENTS" WHERE (USER_ID= {userid})')
        cursor.execute(f'DELETE FROM dbo."POSTS" WHERE (USER_ID= {userid})')
        cursor.execute(f'DELETE FROM dbo."USERS" WHERE (USER_ID= {userid})')
        connection.commit()

            ############post getters##########
    def get_post_postid(self, post_id):
        query = f'SELECT * FROM dbo."POSTS" WHERE (POST_ID= {post_id})'
        result = self.do_query(query)
        return result

    def get_post_userid(self, user_id):
        query = f'SELECT * FROM dbo."POSTS" WHERE (USER_ID= {user_id})'
        result = self.do_query(query)
        return result

    def get_query_in_caption(self, tag):
        query = f"SELECT TOP (1000) * FROM dbo.\"POSTS\" WHERE DESCRIPTION LIKE '%#{tag}%'"
        result = self.do_query(query)
        return result

    def get_post_bulk_userid(self, user_ids):
        user_id_str = "("+", ".join(user_ids)+")"
        query = f'SELECT TOP (1000) * FROM dbo."POSTS" WHERE (USER_ID IN {user_id_str})'
        result = self.do_query(query)
        return result

    def get_post_bulk(self):
        query = f'SELECT TOP (1000) * FROM dbo."POSTS"'
        result = self.do_query(query)
        return result

    def delete_post_id(self, postid):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute(f'DELETE FROM dbo."LIKES" WHERE (POST_ID= {postid})')
        cursor.execute(f'DELETE FROM dbo."COMMENTS" WHERE (POST_ID= {postid})')
        cursor.execute(f'DELETE FROM dbo."POSTS" WHERE (POST_ID= {postid})')
        connection.commit()
        ############comment getters##########

    def get_comment_postid(self, post_id):
        query = f'SELECT * FROM dbo."COMMENTS" WHERE (POST_ID= {post_id})'
        result = self.do_query(query)
        return result

    def delete_comment_id(self, commentid):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute(f'DELETE FROM dbo."COMMENTS" WHERE (COMMENT_ID= {commentid})')
        connection.commit()
        ############likes getters##########

    def get_like_postid(self, post_id):
        query = f'SELECT * FROM dbo."LIKES" WHERE (POST_ID= {post_id})'
        result = self.do_query(query)
        return result

    def get_like_userid(self, user_id):
        query = f'SELECT * FROM dbo."LIKES" WHERE (USER_ID= {user_id})'
        result = self.do_query(query)
        return result

    def get_like_userid_postid(self, user_id, post_id):
        query = f'SELECT * FROM dbo."LIKES" WHERE (USER_ID= {user_id}) AND (POST_ID= {post_id})'
        result = self.do_query(query)
        return result

    def delete_like(self, userid, postid):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute(f'DELETE FROM dbo."LIKES" WHERE (POST_ID= {postid}) AND (USER_ID= {userid})')
        connection.commit()

        ############follows getters##########

    def get_follow_userid(self, user_id):
        query = f'SELECT * FROM dbo."FOLLOWS" WHERE (USER_ID= {user_id})'
        result = self.do_query(query)
        return result

    def get_follow_targetid(self, target_id):
        query = f'SELECT * FROM dbo."FOLLOWS" WHERE (TARGET_ID= {target_id})'
        result = self.do_query(query)
        return result

    def get_follow_userid_targetid(self, user_id, target_id):
        query = f'SELECT * FROM dbo."FOLLOWS" WHERE (USER_ID= {user_id}) AND (TARGET_ID= {target_id})'
        result = self.do_query(query)
        return result

    def delete_follow(self, userid, targetid):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute(f'DELETE FROM dbo."FOLLOWS" WHERE (TARGET_ID= {targetid}) AND (USER_ID= {userid})')
        connection.commit()

    def do_query(self, query):
        connection = pyodbc.connect(self.connect_str)
        pdf = pd.read_sql(query, connection)
        if not pdf.empty:
            return pdf
            # sparkDF = self.spark.createDataFrame(pdf)
            # sparkDF.show()
            # return sparkDF
        return None

    def add_user(self, usr_name, usr_id, first_n, last_n, bio, email, avatar):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        user = (usr_name, usr_id, first_n, last_n, bio, email, avatar)
        cursor.execute("""INSERT INTO dbo."USERS" (USER_NAME, USER_ID, F_NAME, L_NAME, BIO, EMAIL, AVATAR) 
        VALUES (?,?,?,?,?,?,?)""", user)
        connection.commit()

    def add_post(self, user_id, post_id, descript, posted_at):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        post = (user_id, post_id, descript, posted_at)
        cursor.execute("""INSERT INTO dbo."POSTS" (USER_ID, POST_ID, DESCRIPTION, POSTED_AT) 
        VALUES (?,?,?,?)""", post)
        connection.commit()

    def add_like(self, user_id, post_id):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        like = (user_id, post_id)
        cursor.execute("""INSERT INTO dbo."LIKES" (USER_ID, POST_ID) 
        VALUES (?,?)""", like)
        connection.commit()

    def add_comment(self, user_id, post_id, comment_id):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        comment = (user_id, post_id, comment_id)
        cursor.execute("""INSERT INTO dbo."COMMENTS" (USER_ID, POST_ID,COMMENT_ID) 
        VALUES (?,?,?)""", comment)
        connection.commit()

    def add_follows(self, user_id, target_id):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        follow = (user_id, target_id)
        cursor.execute("""INSERT INTO dbo."FOLLOWS" (USER_ID, TARGET_ID) 
        VALUES (?,?)""", follow)
        connection.commit()

    def create_tables(self):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute("""CREATE TABLE dbo."USERS"(
                    USER_NAME CHAR(50) NOT NULL,
                    USER_ID CHAR(50) NOT NULL,
                    F_NAME CHAR(20) NOT NULL,
                    L_NAME CHAR(20) NOT NULL,
                    BIO CHAR(500) NOT NULL,
                    EMAIL CHAR(50) NOT NULL,
                    AVATAR CHAR(300) NOT NULL,
                    PRIMARY KEY (USER_ID)
                    )""")

        cursor.execute("""CREATE TABLE dbo."POSTS"(
                    USER_ID CHAR(50) NOT NULL,
                    POST_ID CHAR(50) NOT NULL,
                    DESCRIPTION CHAR(500) NOT NULL,
                    POSTED_AT CHAR(50) NOT NULL,
                    PRIMARY KEY (POST_ID),
                    FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID)
                    )""")

        cursor.execute("""CREATE TABLE dbo."LIKES"(
                    USER_ID CHAR(50) NOT NULL,
                    POST_ID CHAR(50) NOT NULL,
                    PRIMARY KEY (USER_ID, POST_ID),
                    FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID),
                    FOREIGN KEY(POST_ID) REFERENCES POSTS(POST_ID)
                    )""")

        cursor.execute("""CREATE TABLE dbo."COMMENTS"(
                    POST_ID CHAR(50) NOT NULL,
                    USER_ID CHAR(50) NOT NULL,
                    COMMENT_ID CHAR(50) NOT NULL,
                    PRIMARY KEY (COMMENT_ID),
                    FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID),
                    FOREIGN KEY(POST_ID) REFERENCES POSTS(POST_ID)
                    )""")

        cursor.execute("""CREATE TABLE dbo."FOLLOWS"(
                    USER_ID CHAR(50) NOT NULL,
                    TARGET_ID CHAR(50) NOT NULL,
                    PRIMARY KEY (USER_ID, TARGET_ID),
                    FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID)
                    )""")
        connection.commit()

    def drop_tables(self):
        connection = pyodbc.connect(self.connect_str)
        cursor = connection.cursor()
        cursor.execute("""DROP TABLE dbo.\"COMMENTS\"""")
        cursor.execute("""DROP TABLE dbo.\"LIKES\"""")
        cursor.execute("""DROP TABLE dbo.\"FOLLOWS\"""")
        cursor.execute("""DROP TABLE dbo.\"POSTS\"""")
        cursor.execute("""DROP TABLE dbo.\"USERS\"""")
        connection.commit()


if __name__ == "__main__":
    impl = DBImp()
    print("started db imp")
    # impl.drop_tables()
    # impl.create_tables()
    # impl.add_user("Ronan Todd", "106861690365763932890", "Ronan", "Todd", "yooo whattup!", "rtodd001@ucr.edu", 'https://lh5.googleusercontent.com/-VbGnrq0n_Lk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucn3UXnkEjl8yfQwiZYl4igwtqIxTg/s96-c/photo.jpg')
    # impl.add_user("Matt Walsh", "102380077571627303512", "Matt", "Walsh", "the gamer page", "mwals001@ucr.edu", 'https://cdn.discordapp.com/avatars/669730178506686477/3770dbab3c573190f269434f5b415acb.png')
    # impl.add_post("102380077571627303512", "15", "#gamer", "1607839082.1942532")
    # impl.add_post("106861690365763932890", "2", "greg stole my phone!", "1607839073.1942532")
    impl.delete_user_id("107983112386510286403")
    # ronan = impl.get_user_id("106861690365763932890")
    # matt = impl.get_query_in_user("mat")
    # print(matt)
    # print(impl.get_user_id("102380077571627303512"))
    # print(ronan["USER_ID"])
    # print(ronan["USER_ID"][0] == "106861690365763932890")
    # print(", ".join(list(impl.get_post_bulk_userid(["102380077571627303512", "106861690365763932890"])["DESCRIPTION"])))
