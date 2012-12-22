var url = require("url");
var nonLoginPaths = {
//  "/login": true,
  "/favicon.ico": true
};

var fbId = process.env.FACEBOOK_APP_ID;
var fbSecret = process.env.FACEBOOK_SECRET;
var nonLoginPatterns = ['^/combo~', '^/static'];
module.exports = function(req, res, next) {
    console.log("Url: "+ req.url);
    var urlp= url.parse(req.originalUrl, true);
    if (urlp.query.login_with) {
        req.authenticate([urlp.query.login_with], function(error, authenticated) {
            if (error) {
                console.error(error);
                res.end("Error: " + error);
                return;
            }
            if(authenticated) {
                res.send("<html><h1>Hello Facebook user:" + JSON.stringify( req.getAuthDetails() ) + ".</h1></html>");
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
        res.send('<html>                                              \n\
          <head>                                             \n\
            <title>connect Auth -- Not Authenticated</title> \n\
          </head><body>                                             \n\
            <div id="wrapper">                               \n\
              <h1>Not authenticated</h1>                     \n\
              <div class="fb_button" id="fb-login" style="float:left; background-position: left -188px">          \n\
              <button onclick="location.href=\'\?login_with=google2\'" style="padding:5px;border-radius:5px;border:1px solid #555555;cursor:pointer">\n\
              </div></body></html>');
        return;
	}
    console.log("This means req is authenticated");
    return next();
};
