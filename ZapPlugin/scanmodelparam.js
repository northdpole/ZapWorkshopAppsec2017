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
