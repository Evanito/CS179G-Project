import time
import pyspark


class CS179GController:
    def __init__(self):
        print("Starting controller....")
        start = time.time()
        self.data = {}
        print("Finished in %ss" % (time.time() - start))

    def search(self, mode, query, amount=10):
        pass
