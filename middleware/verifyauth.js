var url = require("url");
var nonLoginPaths = {
  "/login": true,
  "/favicon.ico": true
};

var fbId = process.env.FACEBOOK_APP_ID;
var fbSecret = process.env.FACEBOOK_SECRET;
var nonLoginPatterns = ['^/combo~', '^/static', '^/login'];
module.exports = function(req, res, next) {
    var i;
    console.log("Url: "+ req.url);
    if (nonLoginPaths[req.url]) {
        next();
        return;
    }
    for (i = 0; i < nonLoginPatterns.length; i++) {
        if (req.url.match(nonLoginPatterns[i])) {
            next();
            return;
        }
    }
    var urlp= url.parse(req.originalUrl, true);
    if (urlp.query.login_with) {
        req.authenticate([urlp.query.login_with], function(error, authenticated) {
            if (error) {
                console.error(error);
                res.end("Error: " + error);
                return;
            }
            if(authenticated) {
                res.writeHead(303, { 'Location': urlp.query['orig-url'] });
                res.end('Redirecting');
                //res.send("<html><h1>Hello Google user:" + JSON.stringify( req.getAuthDetails() ) + ".</h1></html>");
                return;
            }
            console.log("not authenitcated!! Facebook authentication failed");
            //res.send("<html><h1>Facebook authentication failed :( </h1></html>");
        });
        return;
    }

    if (req.url == "/logout") {
        req.logout();
        res.writeHead(303, { 'Location': "/" });
        res.end('');
        return;
    };

    if( !req.isAuthenticated() ) {
        console.log("Not authenticated");
        res.writeHead(303, { 'Location': "/login?orig-url=" + req.url });
        res.end('Redirecting to login page');
        return;
	}
    console.log("This means req is authenticated");
    return next();
};
