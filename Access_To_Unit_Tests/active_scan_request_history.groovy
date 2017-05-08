def ZAPApiCall(url, path, query) { //generic api call method
	def ZAProxy = new HTTPBuilder(url)
		data = ZAProxy.request(GET, JSON) { req ->
			uri.path = path
				requestContentType = JSON
				uri.query = query
				headers.Accept = 'application/json'

				// response handler for a successful response code:
				response.success = { resp, json ->
					assert resp.status == 200
						assert resp.contentType == JSON.toString()
						return json
				}
			response.failure = { resp, json ->
				throw new RuntimeException("${json}")
			}
		}
}

def apikey = '<apikey>'
def url = 'localhost:9090'
def applicationURL = "localhost"

// Get proxy history (site-tree) of ZAP and filter duplicates
	path = '/JSON/core/view/sites'
ZAPApiCall(url, path, null)

def list = new JsonSlurper().parseText(JsonOutput.toJson(data))
	def sites = list.sites
sites.unique()

	// Check if applicationURL is found in the proxy history (site-tree) of ZAP.
	println "Checking proxy-history"
	if (!sites.isEmpty()) {
		println "Setting option to scan all headers of request.."
			path = '/JSON/ascan/action/setOptionScanHeadersAllRequests'
			query = [apikey: "${apikey}", Boolean: "true"]
			ZAPApiCall(url, path, query)

			// Exclude certain paths
			String[] excludeSites = ["http://....*"]
			for (String item : excludeSites) {
				regexSite = item
					path = '/JSON/ascan/action/excludeFromScan'
					query = [apikey: "${apikey}", regex: regexSite]
					ZAPApiCall(url, path, query)
			}
		// If multiple applicationURLs are found, perform Active Scan on all URLS
		for (String item : sites) {
			applicationURL = item
				// Only scan sites which end with .<yourdomain>
				if (!applicationURL.endsWith("localhost")) {
					continue;
				}

			// Start Active scan
			println "Starting Active Scan"
				path = '/json/ascan/action/scan'
				query = [apikey : "${apikey}", url: "${applicationURL}",
				      recurse: 'true', inScopeOnly: 'false']
					      ZAPApiCall(url, path, query)
					      def scanId = data.scan
					      println "Started Active Scan: ${scanId} on target: ${applicationURL}"
					      def responseText = "no responses yet"
					      def responseCode = 200
					      // 10 second wait times 6 for one minute times number of minutes.
					      def maxRetries = 30 * 30
					      def retryNum = 0

					      // Poll status of scan
					      while (!responseText.contains("100") && responseCode == 200) {
						      if (retryNum >= maxRetries) {
							      throw new RuntimeException("ZAP Active Scanner has not completed after XXX minutes. Exiting.")
						      }
						      //10 seconds wait time
						      sleep 10000
							      path = '/json/ascan/view/status/'
							      query = [scanId: "${scanId}"]
							      ZAPApiCall(url, path, query)
							      retryNum += 1
							      responseText = data.status
							      println "Scan in progress: ${responseText}"
					      }

			// Fetch alerts of the scan
			path = '/json/core/view/alerts/'
				query = [baseurl: "${applicationURL}"]
				ZAPApiCall(url, path, query)

				def dataAlertList = data.alerts;
			for (alert in dataAlertList) {
				//remove not needed elements from alerts
				alert.remove("description")
					alert.remove("solution")
					alert.remove("reference")
					alert.remove("wascid")
					alert.remove("other")
			}

			// alerts are stored in data object -> print out in console:
			print data
		}
		// Clean up scan and logs -> Create new session
		println "Creating new sessions and clearing previous session data"
			path = '/JSON/core/action/newSession'
			query = [apikey: "${apikey}", overwrite: 'true']
			ZAPApiCall(url, path, query)
	}
else {
	println "All tests have failed or ApplicationURL not found in proxy history of ZAP, therefore Active Scan will not be started"
}
