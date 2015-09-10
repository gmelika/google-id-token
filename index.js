/*
 * Module dependency
 */
var crypto = require('crypto');

// inspired by: http://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
var Base64 = {
	urlEncode: function(str) {
		str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
		return new Buffer(str).toString('base64');
	},
	urlDecode: function(str) {
		str = this.unescape(str);
		return new Buffer(str, 'base64').toString('utf8');
	},
	unescape: function(str) {
		str += Array(5 - str.length % 4).join('=');
		return str.replace(/\-/g, '+').replace(/_/g, '/');
	}
};

/**
 *
 * This is the module constructor for the google-id-token.js
 * 
 */
var gidToken = module.exports = function(options) {
	this.getKeys = options.getKeys;
	this.decode = function(id_token, callback) {
		var result = {
			header: undefined,
			data: undefined,
			isAuthentic: undefined // undefined = we didn't check
		};
		try {
			// check segments
			var segments = id_token.split('.');
			if (segments.length !== 3) {
				var error = new Error("jwt payload is supposed to be composed of 3 base64url encoded parts separated by a '.'");
				callback(error, result);
				return;
			}

			result.header = JSON.parse(Base64.urlDecode(segments[0]));
			result.data = JSON.parse(Base64.urlDecode(segments[1]));
			var signature = Base64.unescape(segments[2]);

			// verify signature.
			var dataToSign = [segments[0], segments[1]].join('.');
			this.verify(dataToSign, result.header.kid, signature, function(err, isVerified) {
				result.isAuthentic = isVerified;
				result.isExpired = (new Date().getTime()) < result.data.exp;
				callback(null, result);
			});
		} catch (exception) {
			callback(exception, result);
		}
	};
	this.verify = function(payload, kid, providedSignature, callback) {
		var verifier = crypto.createVerify("RSA-SHA256");
		verifier.update(payload);
		this.getKeys(kid, function(err, key) {
			if(err || !key) {
				callback(err || "unable to get the signing certificate", null);
			} else {
				callback(null, verifier.verify(key, providedSignature, 'base64'));
			}
		});
	};
};
