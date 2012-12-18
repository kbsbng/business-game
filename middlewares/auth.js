var openid = require('openid');
var url = require('url');
var nonLoginPaths = {
    "/login" : true,
    "/favicon.ico" : true
};
var nonLoginPatterns = [ '^/combo~', '^/static' ];
module.exports = //function(config) {
    //return
    function(req, res, next) {
        console.log("called login handler");
        var parsedUrl = url.parse(req.url, true);
        var i;
        var relyingParty = new openid.RelyingParty(
            parsedUrl.protocol + "//" + parsedUrl.host + "/",
            null,
            false,
            false,
            []);
        if(parsedUrl.pathname === "/authenticate") {
             relyingParty.authenticate(parsedUrl.query['openid-identifier'],
                 false,
                 function(error, authUrl) {
                     if (error) {
                         res.writeHead(200);
                         res.end('Authentication failed: ' + error.message);
                         return;
                     }
                     if (!authUrl) {
                         res.writeHead(200);
                         res.end('Authentication failed');
                         return;
                     }

                     res.writeHead(302, { Location: authUrl });
                     res.end();
                 });
             return;
        }

        console.log(parsedUrl.pathname);
        if (nonLoginPaths[parsedUrl.pathname] === true) {
            return next();
        }
        for (i = 0; i < nonLoginPatterns.length; i++) {
            if (parsedUrl.pathname.match(nonLoginPatterns[i]) !== null) {
                return next();
            }
        }
        var result = openid.verifyAssertion(req);
        if (result.authenticated) {
            return next();
        }

        res.writeHead(302, { Location: parsedUrl.protocol + "//" + parsedUrl.host + "/login" });
        res.end();
    //};
};
