var nonLoginPaths = {
//  "/login": true,
  "/favicon.ico": true
};

var fbId = process.env.FACEBOOK_APP_ID;
var fbSecret = process.env.FACEBOOK_SECRET;
var nonLoginPatterns = ['^/combo~', '^/static'];
module.exports = function(req, res, next) {
    console.log("Url: "+ req.url);
    if (req.url == "/auth/facebook") {
        req.authenticate(['facebook'], function(error, authenticated) {
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
            <script src="http://static.ak.fbcdn.net/connect/en_US/core.js"></script> \n\
          </head><body>                                             \n\
            <div id="wrapper">                               \n\
              <h1>Not authenticated</h1>                     \n\
              <div class="fb_button" id="fb-login" style="float:left; background-position: left -188px">          \n\
                <a href="/auth/facebook" class="fb_button_medium">        \n\
                  <span id="fb_login_text" class="fb_button_text"> \n\
                    Connect with Facebook                    \n\
                  </span>                                    \n\
                </a>                                         \n\
              </div></body></html>');
        return;
	}
    console.log("This means req is authenticated");
    return next();
};
