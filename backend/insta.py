import sqlite3  # get connected to libr


###############################################################################cut 1
# All tables
###############################################################################cut 2
# USER (usr_id , f_name, last name, bio, email)
###############################################################################cut 3
# use .execute for only 1 command
# use .executemany for many
# c.executemany("INSERT INTO USER VALUES (?,?,?,?,?,?)", many_users)
###############################################################################cut 4
# .fetchone() for only one also can do this to fetch the index ==> (c.fetchone()[0]) which gives the user id and so on
# .fetchmany()
# .fetchall()
# print("Check to see if we actually added data")
# c.execute("SELECT * FROM USER")
# print(c.fetchall())
###############################################################################cut 5
############################################################################### last cut for now

class InstaBase:
    def __init__(self, db_name="insta.db"):
        print("start here........")
        try:
            self.connect = sqlite3.connect(db_name)  # connect to DB
            print("We are connected to the insta.db ->")
        except Exception as e:
            print("error durint connection: ", str(e))
        self.con = self.connect.cursor()  # cursor

    ############################################################################################################ functions are below
    def add_user(self, usr_name, usr_id, first_n, last_n, bio, email):
        print("Adding to table user......")
        user = [(usr_name, usr_id, first_n, last_n, bio, email)]
        self.con.executemany("INSERT INTO USER VALUES (?,?,?,?,?,?)", user)
        print("command executed")

    # def get_user_id(id)
    def add_photo(self, user_id, photo_id):
        # todo we need a BLOB for the actual image content
        print("Adding to table photos......")
        # todo there should a photo in pic add later
        pic = [(user_id, photo_id)]
        self.con.executemany("INSERT INTO PHOTOS VALUES (?,?)", pic)
        print("Photo added.........")

    def add_likes(self, user_id, photo_id, like_id):
        print("Adding to table likes......")
        likes = [(user_id, photo_id, like_id)]
        self.con.executemany("INSERT INTO LIKES VALUES (?,?,?)", likes)
        print("Like added........")

    def add_comment(self, user_id, photo_id, cmnt_id, content):
        print("Adding to table CMNT......")
        cmnt = [(user_id, photo_id, cmnt_id, content)]
        self.con.executemany("INSERT INTO CMNT VALUES (?,?,?,?)", cmnt)
        print("comment added........")

    def add_tag(self, user_id, photo_id, tag_id, user_name, content):
        print("Adding to table tags......")
        tag = [(user_id, photo_id, tag_id, user_name, content)]
        self.con.executemany("INSERT INTO TAG VALUES (?,?,?,?,?)", tag)
        print("TAG added to the table.......")

    ####################################################################### USER GET FUNCTIONS  ################################################################################################
    def get_user_username(self, username):
        use = username
        self.con.execute("SELECT * FROM USER WHERE (USER_NAME = ?)", (use,))

    def get_user_id(self, userid):
        con = self.connect.cursor()  # cursor
        useid = userid
        con.execute("SELECT * FROM USER WHERE (USER_ID = ?)", (useid,))

    def get_user_fname(self, firstname):
        use = firstname
        self.con.execute("SELECT * FROM USER WHERE (F_NAME = ?)", (use,))

    def get_user_lname(self, lastname):
        use = lastname
        self.con.execute("SELECT * FROM USER WHERE (L_NAME = ?)", (use,))

    def get_user_email(self, email):
        use = email
        self.con.execute("SELECT * FROM USER WHERE (EMAIL = ?)", (use,))

    def get_user_bio(self, bio):
        use = bio
        self.con.execute("SELECT * FROM USER WHERE (BIO = ?)", (use,))

    ####################################################################### PHOTOS GET FUNCTIONS  ################################################################################################
    def get_photo_userid(self, userid):
        use = userid
        self.con.execute("SELECT * FROM PHOTOS WHERE (USER_ID = ?)", (use,))

    def get_photo_photoid(self, photoid):
        use = photoid
        self.con.execute("SELECT * FROM PHOTOS WHERE (PHOTO_ID = ?)", (use,))

    ####################################################################### Likes GET FUNCTIONS  ################################################################################################
    # userid   photoid  likeid
    def get_likes_userid(self, user_id):
        use = user_id
        self.con.execute("SELECT * FROM LIKES WHERE (USER_ID = ?)", (use,))

    def get_likes_photoid(self, photo_id):
        photo = photo_id
        self.con.execute("SELECT * FROM LIKES WHERE (PHOTO_ID = ?)", (photo,))

    def get_likes_likeid(self, like_id):
        likes = like_id
        self.con.execute("SELECT * FROM LIKES WHERE (LIKE_ID = ?)", (likes,))

    ####################################################################### comment GET FUNCTIONS  ################################################################################################
    # userid   photoid  coment_id
    def get_comment_userid(self, user_id):
        use = user_id
        self.con.execute("SELECT * FROM CMNT WHERE (USER_ID = ?)", (use,))

    def get_comment_photoid(self, photo_id):
        photo = photo_id
        self.con.execute("SELECT * FROM CMNT WHERE (PHOTO_ID = ?)", (photo,))

    def get_comment_commentid(self, comment_id):
        comment = comment_id
        self.con.execute("SELECT * FROM CMNT WHERE (CMNT_ID = ?)", (comment,))

    def get_comment_content(self, content):  # we dont need this most likely but what ever
        cntnt = content
        self.con.execute("SELECT * FROM CMNT WHERE (CONTENT = ?)", (cntnt,))

    ####################################################################### tags GET FUNCTIONS  ################################################################################################
    # userid   photoid  tag_id  username content
    def get_tag_userid(self, user_id):
        use = user_id
        self.con.execute("SELECT * FROM TAG WHERE (USER_ID = ?)", (use,))

    def get_tag_photoid(self, photo_id):
        photo = photo_id
        self.con.execute("SELECT * FROM TAG WHERE (PHOTO_ID = ?)", (photo,))

    def get_tag_tagid(self, tag_id):
        tag = tag_id
        self.con.execute("SELECT * FROM TAG WHERE (TAG_ID = ?)", (tag,))

    def get_tag_username(self, username):
        usr = username
        self.con.execute("SELECT * FROM TAG WHERE (USER_NAME = ?)", (usr,))

    def get_tag_content(self, content):
        cntnt = content
        self.con.execute("SELECT * FROM TAG WHERE (CONTENT = ?)", (cntnt,))


    ########################################################################################################################################################################################
    def fether(self):  # call it if you need commands results print out
        items = self.con.fetchall()
        for i in items:
            print(i)

    def create_tables(self):
        print("Creating tables......")
        self.con.execute(""" CREATE TABLE USER(
            USER_NAME CHAR(20) NOT NULL,
            USER_ID CHAR(20) NOT NULL,
            F_NAME CHAR(20) NOT NULL,
            L_NAME CHAR(20) NOT NULL,
            BIO CHAR(20) NOT NULL,
            EMAIL CHAR(20) NOT NULL,
            PRIMARY KEY (USER_ID)
            )""")
        self.con.execute(""" CREATE TABLE PHOTOS(
            USER_ID char(20) NOT NULL,
            PHOTO_ID INTEGER NOT NULL,
            primary key(PHOTO_ID),
            FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID)
            )""")
        self.con.execute(""" CREATE TABLE LIKES(
            USER_ID char(20) NOT NULL,
            PHOTO_ID INTEGER NOT NULL,
            LIKE_ID INTEGER NOT NULL,
            primary key(LIKE_ID),
            FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID),
            FOREIGN KEY(PHOTO_ID) REFERENCES PHOTOS(PHOTO_ID)
            );""")
        self.con.execute(""" CREATE TABLE CMNT(
            USER_ID char(20) NOT NULL,
            PHOTO_ID INTEGER NOT NULL,
            CMNT_ID INTEGER NOT NULL,
            CONTENT char(100) NOT NULL,
            primary key(CMNT_ID),
            FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID),
            FOREIGN KEY(PHOTO_ID) REFERENCES PHOTOS(PHOTO_ID)
            );""")
        self.con.execute(""" CREATE TABLE TAG(
            USER_ID char(20) NOT NULL,
            PHOTO_ID INTEGER NOT NULL,
            TAG_ID INTEGER NOT NULL,
            USER_NAME CHAR(20) NOT NULL,
            CONTENT char(50),
            primary key(TAG_ID),
            FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID),
            FOREIGN KEY(USER_NAME) REFERENCES USER(USER_NAME),
            FOREIGN KEY(PHOTO_ID) REFERENCES PHOTOS(PHOTO_ID)
            );
            """)
        print("command executed")

    def main(self):
        self.create_tables()
        self.add_user("dreband", "1", "dre", "band", "hi bye", "band@gmail.com")
        self.add_user("mwalsh", "2", "matt", "walsh", "none", "mwalsh@gmail.com")
        self.add_user("rtod", "3", "ronan", "todd", "this bio is the sh******", "rtodd@gmail.com")
        self.add_user("thisisevan", "4", "Evan", "Gierst", "Im a genius", "egierst@gmail.com")

        self.add_photo("3", 23)
        self.add_photo("2", 22)
        self.add_photo("1", 21)

        self.add_likes(1, 23, 10)
        self.add_likes(2, 22, 11)
        self.add_likes(3, 21, 12)

        self.add_comment("1", 23, 1, "cntnt #1")
        self.add_comment("2", 22, 2, "cntnt #2")
        self.add_comment("3", 23, 3, "cntnt #3")

        self.add_tag(4, 23, 1, "rtod", "whats up @rtod")
        self.add_tag(2, 22, 2, "rtod", "hello @rtod")
        self.add_tag(4, 21, 3, "dreband", "yo yo @dreband")

        # get_user_username("mwalsh") #worked)
        # fether() # to fetch and show commands
        # get_user_id(4)
        # get_user_fname("dre")
        # fether()
        # get_user_lname("Gierst")
        # fether()
        # get_user_email("rtodd@gmail.com")
        # fether()
        # get_user_bio("Im a genius")
        # fether()
        # get_photo_userid(2)
        # fether()
        # get_photo_photoid(21)
        # fether()
        # c.execute("SELECT * FROM TAG")
        # get_comment_photoid(23)
        # fether()
        # get_comment_commentid(2)
        # fether()
        # get_comment_content("cntnt #1")
        # fether()
        # get_tag_tagid(1)
        # fether()
        # get_tag_userid(2)
        # fether()
        self.get_tag_username("rtod")
        self.fether()

        # null /integer /real /text / BLOB : phote for instanse  /
        self.connect.commit()
        print("Records created successfully")
        #self.connect.close()  # close connection


if __name__ == "__main__":
    db = InstaBase()
    db.fether()


































