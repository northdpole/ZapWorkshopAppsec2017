import os
import unittest
from pprint import pprint

from selenium import webdriver


class AweberTest(unittest.TestCase):
    proxy = '127.0.0.1:8090'
    # wdUrl = 'http://localhost:4444/wd/hub' #Used in case we're running on a remote webdriver (for performance)
    url = 'http://127.0.0.1:7070'
    curr_dir = (os.path.dirname(os.path.realpath(__file__)))
    logs = curr_dir+'../logs/unittest.log'

    @classmethod
    def setUpClass(cls):
        os.environ["PATH"] += os.pathsep + cls.curr_dir+"/../"
        capabilities = webdriver.DesiredCapabilities.FIREFOX
        capabilities['marionette'] = False

        proxy = webdriver.Proxy({'proxyType':'MANUAL','httpProxy':cls.proxy,'sslProxy':cls.proxy})
        capabilities = proxy.add_to_capabilities(capabilities)

        cls.driver = webdriver.Firefox(capabilities=capabilities,proxy=proxy,log_path=cls.logs)

    def test_alive(self):
        self.driver.get(self.url+'')
        self.assertEqual(self.driver.find_element_by_tag_name('body').text,u'Hello World!')

    def test_name(self):
        self.driver.get(self.url+'/hi?query=John')
        self.assertEqual(self.driver.find_element_by_id('query').text,'John')

    def test_hidden(self):
        self.driver.get(self.url+'/hi?hidden=John')
        self.assertEqual(self.driver.find_element_by_id('hidden').text,'John')

    def test_nx(self):
        self.driver.get(self.url+'/hi?nx=Doe')
        self.assertEqual(self.driver.find_element_by_id('nx').text,'Doe')

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()