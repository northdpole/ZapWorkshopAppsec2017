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