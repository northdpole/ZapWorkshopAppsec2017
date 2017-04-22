#!/usr/bin/env/python

import time
from pprint import pprint
from zapv2 import ZAPv2
import os
import subprocess

zap_path='/var/www/html/ZAPWorkshop/ZAP_2.5.0/zap.sh'

print 'Starting ZAP ...'
subprocess.Popen([zap_path,'-daemon','-port 8090'],stdout=open(os.devnull,'w'))
print 'Waiting for ZAP to load, 10 seconds ...'
time.sleep(10)

# Here the target is defined and an instance of ZAP is created.
target = 'http://localhost/Call_ZAP_in_BlackBox_Mode/app/'
zap = ZAPv2()

# Use the line below if ZAP is not listening on 8090.
zap = ZAPv2(proxies={'http': 'http://127.0.0.1:8090'})

# ZAP starts accessing the target.
print 'Accessing target %s' % target
zap.urlopen(target)
time.sleep(2)

# The spider starts crawling the website for URLs
print 'Spidering target %s' % target
zap.spider.scan(target)

# Progress of spider
time.sleep(2)
print 'Status %s' % zap.spider.status
while (int(zap.spider.status) < 100):
   print 'Spider progress %: ' + zap.spider.status

   time.sleep(400)

print 'Spider completed'

# Give the passive scanner a chance to finish
time.sleep(5)

# The active scanning starts
print 'Scanning target %s' % target
zap.ascan.scan(target)
while (int(zap.ascan.status) < 100):
   print 'Scan progress %: ' + zap.ascan.status

   time.sleep(600)

print 'Scan completed'

# Report the results
print 'Hosts: ' + ', '.join(zap.core.hosts)
print 'Alerts: '

for element in alerts["alerts"]:
   # Navigation alert, alerts contain a list which contains a dictionary
   del element["description"]
   del element["solution"]
   del element["id"]
   del element["messageId"]
   del element["reliability"]
   del element["other"]
   del element["reference"]
   del element["param"]

# To close ZAP:
zap.core.shutdown()
pprint(zap.core.alerts())
