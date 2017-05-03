import os
import time
from pprint import pprint
from zapv2 import ZAPv2
import traceback
from subprocess import Popen

apiKey = '12345'
curr_dir = (os.path.dirname(os.path.realpath(__file__)))
logs_dir = curr_dir+'/logs'
print 'Logs dir is '+ logs_dir

zap_logfile = logs_dir + '/zapErrors.log'
zap_path = curr_dir+'/../ZAP_2.6.0/zap.sh'
print('Starting ZAP ...')
proc = Popen([zap_path,'-port','8090', '-daemon', '-config','api.key=12345','-dir','/tmp/'+str(time.clock())], stdout=open(zap_logfile, 'w+'))
print('Waiting for ZAP to load, 10 seconds ...')
time.sleep(10)

selenium_path = curr_dir+'/selenium-server-standalone-3.3.1.jar'
selenium_logfile = logs_dir+'/selenium.log'
print ('Starting Selenium server...')
selenium = Popen(['java','-jar',selenium_path], stdout=open(selenium_logfile, 'w+'))
print ('Waiting for selenium to load, 10 seconds ...')
time.sleep(10)


# Here the target is defined and an instance of ZAP is created.Q
target = 'http://127.0.0.1:7070/app/index.php'

#start a php server running on the url
php_logfile = logs_dir+'/acces.log'
server = Popen(['php', '-S', '127.0.0.1:7070'], stdout=open(php_logfile, 'w+'))

main_test_file = curr_dir+'/app/fooTest.php'
phpunit_logfile = logs_dir + '/phpunit.log'
print('Proxied Unittests running')
unitests = Popen(['./vendor/phpunit/phpunit/phpunit', main_test_file], stdout=open(phpunit_logfile, 'w+'))
print ('Waiting for tests to finish, 10 seconds ...')
time.sleep(10)  # give unit tests a chance to run

zap = ZAPv2(apikey=apiKey, proxies={'http': 'http://127.0.0.1:8090','https':'http://127.0.0.1:8090'})

# Use the line below if ZAP is not listening on 8090.



# ZAP starts accessing the target.
try:

    print('Accessing target %s' % target)
    zap.urlopen(target)
    time.sleep(2)

    # The spider starts crawling the website for URLs missed by the unit tests
    print('Spidering target %s' % target)
    spiderId = zap.spider.scan(target)
    # Progress of spider

    time.sleep(2)
    print('Status %s' % zap.spider.status(spiderId))
    while (int(zap.spider.status(spiderId)) < 100):
        print('Spider progress %: ' + zap.spider.status(spiderId))
        time.sleep(4)

    print('Spider completed')

    # Give the passive scanner a chance to finish
    time.sleep(5)

    # The active scanning starts
    print('Scanning target %s' % target)
    zap.ascan.set_option_rescan_in_attack_mode(True)
    scanid = zap.ascan.scan(url=target,recurse=True,inscopeonly=False)
    while (int(zap.ascan.status(scanid)) < 100):
        print('Scan progress %: ' + zap.ascan.status(scanid))
        # time.sleep(6)
    print('Scan completed')

    # Report the results
    print ('Hosts: ' + ', '.join(zap.core.hosts))
    print ('Alerts: ')
    for element in zap.core.alerts():
        # Navigation alert, alerts contain a list which contains a dictionary
        pprint(element["description"])
        # del element["solution"]
        # pprint(element["id"])
        # pprint(element["messageId"])
        # del element["reliability"]
        # del element["other"]
        # del element["reference"]
        pprint(element["param"])

    # To close ZAP:
    zap.core.shutdown()
    # pprint(zap.core.alerts())
except Exception, e:
    print(e)
    traceback.prifnt_exc()
finally:
    proc.kill()
    selenium.kill()
    server.kill()
    unitests.kill()