<<<<<<< HEAD
if (typeof println == 'undefined') this.println = print;

function sendingRequest(msg, initiator, helper) {
    // Debugging can be done using println like this
    println('sendingRequest called for url=' + msg.getRequestHeader().getURI().toString())
    println('request body:'+msg.getRequestBody());
    println('request body:'+msg.getRequestBody().toString());
    urlEncoded = encodeForPOST(JSON.parse(msg.getRequestBody().toString()));
    msg.setRequestBody(urlEncoded);

    println('new message body = '+msg.getRequestBody().toString());
    msg.setRequestHeader(msg.getRequestHeader().toString().replace('Content-Type: application/json','Content-Type: application/x-www-form-urlencoded'));
    return true;
    parseParameters(helper,msg);

}

function responseReceived(msg, initiator, helper) {
    // Debugging can be done using println like this
    println('responseReceived called for url=' + msg.getRequestHeader().getURI().toString())
    println('body:'+msg.getRequestBody().toString());

}

//register the parameters
function parseParameters(helper, msg) {
    println('parseParameters');
    dump(msg);
    // Debugging can be done using println like this
    println('Google variant called for url=' + msg.getRequestheader().getURI().toString());

    query = msg.getRequestheader().getURI().toString();

    if (query == null) {
        return;
    }

    idx = query.indexOf("#");
    if (idx >= 0) {
        data = query.substring(idx + 1);
        vars = data.split("&");
        for (var i = 0; i < vars.length; i++) {
            pair = vars[i].split("=");
            helper.addParamQuery(pair[0], pair[1]);
        }
    }
}

//will be called by the plugins to set attack values
function setParameter(helper, msg, param, value, escaped) {
    println('setParameter');
    size = helper.getParamNumber();
    if (size > 1) {
        query = helper.getParamValue(size);

        for (var i = 0; i < size; i++) {
            pname = getParamName(i);
            pvalue = getParamValue(i);
            if (pname == param) {
                pvalue = value;
            }

            query = pname + "=" + pvalue + "&" + query;
        }

        uri = msg.getRequestHeader().getURI().toString();
        idx = uri.indexOf("#");
        uri = uri.substring(0, idx);
        uobj = new URI(uri);
        msg.getRequestHeader().setURI(uobj);
        jsonBody = decodePOSTToJSON(query);
        msg.setReqestBody(jsonBody);
    }
}


// This should probably only be used if all JSON elements are strings
function encodeForPOST(srcjson){
    if(typeof srcjson !== "object"){
        println("\"srcjson\" is not a JSON object it is a "+typeof srcjson);
        return null;
    }
    u = encodeURIComponent;
    var urljson = "";
    var keys = Object.keys(srcjson);
    for(var i=0; i <keys.length; i++){
        urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
        if(i < (keys.length-1))urljson+="&";
    }
    return urljson;
}

// Will only decode as strings
// Without embedding extra information, there is no clean way to
// know what type of variable it was.
function decodePOSTToJSON(urljson){
    println('decodePOSTToJSON');
    var dstjson = {};
    var ret;
    var reg = /(?:^|&)(\w+)=(\w+)/g;
    while((ret = reg.exec(urljson)) !== null){
        dstjson[ret[1]] = ret[2];
    }
    return dstjson;
}

function dump(obj){
    println('dumping object');
    var out='';
    for(var i in obj){
        out+=i+':'+obj[i]+'\n';
    }
    println(out);
}
=======
/*
Polishing:
Checking if string is valid json or not http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try/3710226
*/

/*
* New script it only needs to scan the username and password parameters
* */

if (typeof println == 'undefined') this.println = print;

/**
 * This function allows interaction with proxy requests (i.e.: outbound from the browser/client to the server).
 *
 * @param msg - the HTTP request being proxied. This is an HttpMessage object.
 */
function proxyRequest(msg) {
    // Debugging can be done using println like this
    println('proxyRequest called for url=' + msg.getRequestHeader().getURI().toString())
    var body = msg.getRequestBody().toString()
    return true

}
function proxyResponse(msg) {
    return true
}



function proxyRequest(msg) {
}
function proxyResponse(msg) {
  //Leave response alone, pritty please
  return true;
}

//Recursively accesses all of the json object and adds each of it's parameters as a post parameter
function iterate(helper,obj, stack) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        iterate(helper,obj[property], stack + '.' + property);
      } else {
        helper.addParamPost(property,obj[property]);
      }
    }
  }
}
//url decodes the body
function unpackBody(model){
  var body_model_val =  decodeURIComponent(model.getRequestBody().toString());
  return body_model_val;
}
//unpacks the json object found in the body after model=
function extractJsonObject(body){
  idx = body.indexOf("model=");
  var data = body.split("model=");
  if (idx >= 0) {
    data = data[1].split("&");
    return JSON.parse(data[0]);
  }
}

//TODO: Iterate doesn't recognize arrays, fixed it in this but not in Iterate
function setParamInOriginalJson(originalJson,key,val){
  println("Traversing original JSON in order to set "+val+" to "+key);
  for (var property in originalJson) {
    if (originalJson.hasOwnProperty(property)) {
      println("Property == "+property);
      if (typeof originalJson[property] == "object" && !Array.isArray()) {
        println("recursing on property ");
        originalJson[property] = setParamInOriginalJson(originalJson[property], key, val);
      }else if(Array.isArray()){
        jsonArr = originalJson[property];
        for(element in jsonArr){
          if (property == key) {
            println('found Property in array');
            originalJson[property] = val;
              println('set value '+val);
          }else{
            println("property not found in array");
          }
        }
      }
      if (property == key) {
        println('found Property');
        originalJson[property] = val;
          println('set value '+val);
      }else{
        println("property not found");
      }
    }
  }
    println("returning "+JSON.stringify(originalJson));
    return originalJson;

}



  // The parseParameter function will typically be called for every page and
  // the setParameter function is called by each active plugin to bundle specific attacks

  // Note that new custom input vector scripts will initially be disabled
  // Right click the script in the Scripts tree and select "enable"
  // Callback!
  function parseParameters(helper, msg) {
    println("ParaseParemeters called for msg "+msg.getRequestBody());
    body = unpackBody(msg);
    println("body unpacked to "+body);
    if (body === null) {
      return;
    }
    var json = extractJsonObject(body);
    println("json is "+JSON.stringify(json));
    iterate(helper,json,'');

  }

  //CALLBACK!
  function setParameter(helper, msg, param, value, escaped) {
    println('setParameter Called for:' + param.toString());
    original_json = extractJsonObject(unpackBody(msg));
    size = helper.getParamNumber();
    if (size > 1) {
      println('size was '+size);
      for (var i = 1; i <= size; i++) {
        try{
          println('b4 getParamName with i='+i);
          pname = helper.getParamName(i);
          println('after getParamName');
          pvalue = helper.getParamValue(i);
          println('working with parameter '+pname+' with value '+value);
          if (pname == param) {
            println('found parameter '+pname+' with value '+value);
            pvalue = value;
          }
          println("setting parameter "+pname+" back in original");
          original_json = setParamInOriginalJson(original_json,pname,value.toString());
          println("done "+JSON.stringify(original_json));
        }catch(err){
          println("There was an error "+err.message);
        }

      body = msg.getRequestBody().toString();
      idx = body.indexOf("model=");
      modelVal = body.substring(0, idx);
      uobj = "model=" + encodeURI(JSON.stringify(original_json));
      println("updated body with attack vectors:"+uobj);
      msg.setRequestBody(uobj);
      msg.getRequestHeader().setContentLength(msg.getRequestBody().length());
    }}
  }
>>>>>>> 83b8f41... added a zap plugin example
