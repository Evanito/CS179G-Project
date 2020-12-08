import time
import data_controller


class CS179GController:
    def __init__(self):
        print("Starting controller....")
        start = time.time()
        self.dbc = data_controller.InstaController()
        print("Finished in %ss" % (time.time() - start))

    def search(self, mode, query, amount=10):
        pass

    def get_user_by_id(self, id):
        # user = self.dbc.get_user_id(id)
        # print(user)
        return {
            "id": "696969",
            "username": "greg",
            "email": "greg@greg.com",
        }

    def get_user_by_login(self, login):
        return {
            "id": "696969",
            "username": "greg",
            "email": "greg@greg.com",
        }

    def get_user_timeline(self, id):
        pass