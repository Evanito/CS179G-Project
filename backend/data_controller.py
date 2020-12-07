import pyspark
from pyspark.sql.types import *
import insta


class InstaController:
    def __init__(self):
        self.db = insta.InstaBase(":memory:")
        print(self.db.connect.total_changes)
        self.db.main()
        print(self.db.connect.total_changes)

    def get_user_id(self, id):
        out = self.db.get_user_id(id)
        return out