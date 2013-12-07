[![Build Status](https://travis-ci.org/gmelika/google-id-token.png)](https://travis-ci.org/gmelika/google-id-token)

google-id-token
===============

Decodes and verifies the signature on a google id_token.

## Instructions

This module relies on you to provide a function that would return the google certificates that will be used for signature validation.  This is to allow the module to adapt to whatever caching strategy the host application intends to have.

A simple method that hits the google url every time is below:

```javascript
var request = require('request');
// kid = the key id specified in the token
function getGoogleCerts(kid, callback) {
    request({uri: 'https://www.googleapis.com/oauth2/v1/certs'}, function(err, response, body){
        if(err && response.statusCode !== 200) {
            err = err || "error while retrieving the google certs";
            console.log(err);
            callback(err, {})
        } else {
            var keys = JSON.parse(body);
            callback(null, keys[kid]);
        
    });
}
```

And below is how you would use the module to parse a google id_token

```javascript
var googleIdToken = require('google-id-token')
var parser = new googleIdToken({ getKeys: getGoogleCerts });
parser.decode(sampleGoogleIDToken, function(err, token) {
    if(err) {
        console.log("error while parsing the google token: " + err);
    } else {
        console.log("parsed id_token is:\n" + JSON.stringify(token));
    }
});
```

