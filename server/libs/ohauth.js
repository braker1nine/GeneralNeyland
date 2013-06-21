(function(context) {

var ohauth = {};

ohauth.qsString = function(obj) {
    delete obj.realm;
    return Object.keys(obj).sort().map(function(key) {
        if (key != 'realm') {
            return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
        } else {
            return '';
        }
    }).join('&');
};

ohauth.sha = sha1();

ohauth.stringQs = function(str) {
    return str.split('&').reduce(function(obj, pair){
        var parts = pair.split('=');
        obj[parts[0]] = (null === parts[1]) ? '' : decodeURIComponent(parts[1]);
        return obj;
    }, {});
};

// Editing for 
ohauth.xhr = function(method, url, auth, data, options) {
    var format;
    if (auth.format) {
        format = auth.format;
        delete auth.format;
    }
    var headers = (options && options.header) || { 'Content-Type': 'application/x-www-form-urlencoded' };
    var authHeader ='OAuth ' + ohauth.authHeader(auth);
    console.log('Request URL = ', url);
    console.log('Auth header = ', authHeader);
    if (format) url += '?format=' + format;
    return Meteor.http.get(url, {
        headers: {
            'Authorization':authHeader,
        }
    });
};

ohauth.nonce = function() {
    for (var o = ''; o.length < 6;) {
        o += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'[Math.floor(Math.random() * 61)];
    }
    return o;
};

ohauth.authHeader = function(obj) {

    var ret = 'realm="yahooapis.com", ';
    delete obj.realm;
    ret += Object.keys(obj).sort().map(function(key) {
        if (key != 'realm') {
            return encodeURIComponent(key) + '="' + encodeURIComponent(obj[key]) + '"';
        } else {
            return '';
        }
    }).join(', ');
    return ret;
};

ohauth.timestamp = function() { return ~~((+new Date()) / 1000); };

ohauth.percentEncode = function(s) {
    return encodeURIComponent(s)
    .replace(/\!/g, '%21').replace(/\'/g, '%27')
    .replace(/\*/g, '%2A').replace(/\(/g, '%28').replace(/\)/g, '%29');
};

ohauth.baseString = function(method, url, params) {
    if (params.oauth_signature) delete params.oauth_signature;
    return [
        method,
        ohauth.percentEncode(url),
        ohauth.percentEncode(ohauth.qsString(params))].join('&');
};

ohauth.signature = function(oauth_secret, token_secret, baseString) {
    return ohauth.sha.b64_hmac_sha1(
        ohauth.percentEncode(oauth_secret) + '&' +
        ohauth.percentEncode(token_secret),
        baseString);
};

context.ohauth = ohauth;

})(this);
