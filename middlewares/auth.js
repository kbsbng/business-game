var openid = require('openid');
var url = require('url');
var nonLoginPaths = {
    "/login" : true,
    "/favicon.ico" : true
};

var conf = {
    "dev" : {
        "host" : "http://localhost:5000"
    },
    "production" : {
        "host" : "http://business-game.kbsbng.com"
    }
};
var env = "dev";
if (process.env.NODE_ENV == "production") {
    env ="production";
}
console.log("env: "+env);
var config = conf[env];
var nonLoginPatterns = [ '^/combo~', '^/static' ];
module.exports = 
    function(req, res, next) {
        console.log(req.headers);
        console.log("called login handler: " + req.url);
        var parsedUrl = url.parse(req.url, true);
        var i;
        var relyingParty = new openid.RelyingParty(
            config.host + "/verify",
            config.host + "/",
          false,
            false,
            []);

        console.log(parsedUrl);
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
        if (parsedUrl.pathname === "/verify") {
            console.log("Verify called");
            var result = openid.verifyAssertion(req, function(error, result) {
                res.writeHead(200);
                
                if (error || !result.authenticated) {
                    res.end("Auth failed");;
                    return;
                }
                res.end("Success");
                return;
            });
            return;
        }

        res.writeHead(302, { Location: config[env] + "/login" });
        res.end();
};
