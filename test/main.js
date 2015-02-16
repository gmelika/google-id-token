var should = require('should');
var googleIdToken = require('../index');

var jwt1 = "eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
var jwt1_decoded = {
    header: {"typ":"JWT","alg":"HS256"},
    data: {"iss":"joe","exp":1300819380,"http://example.com/is_root":true},
    isAuthentic: null,
    isExpired: false
};

describe('googleIDToken', function() {
    describe('with an example jwt ', function() {
        it('should return a valid structure', function() {
            var parser = new googleIdToken({ getKeys: function(err, cb) { cb(null,null); } });
            var result = parser.decode(jwt1, function(err, token) {
                token.should.eql(jwt1_decoded);
            });
        });
        it('should fail with error if token does not consist of three dot-separated parts', function() {
            var malformedJWT = 'foobar';
            var parser = new googleIdToken({ getKeys: function(err, cb) { cb(null,null); } });
            var result = parser.decode(malformedJWT, function(err, token) {
                err.should.exist;
                err.should.be.an.instanceOf(Error);
                token.should.exist;
                token.should.have.property('data', undefined);
                token.should.have.property('header', undefined);
                token.should.have.property('isAuthentic', undefined);
            });
        });
        it('should fail with error if token not parseable', function() {
            var malformedJWT = 'a.b.c';
            var parser = new googleIdToken({ getKeys: function(err, cb) { cb(null,null); } });
            var result = parser.decode(malformedJWT, function(err, token) {
                err.should.exist;
                err.should.be.an.instanceOf(Error);
                token.should.exist;
                token.should.have.property('data', undefined);
                token.should.have.property('header', undefined);
                token.should.have.property('isAuthentic', undefined);
            });
        });
    });
});
