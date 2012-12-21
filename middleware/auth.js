var auth = require('connect-auth');
var nonLoginPaths = {
//  "/login": true,
  "/favicon.ico": true
};
const fbCallbackAddress = "http://business-game.kbsbng.com/auth/facebook";

var fbId = process.env.FACEBOOK_APP_ID;
var fbSecret = process.env.FACEBOOK_SECRET;
var nonLoginPatterns = ['^/combo~', '^/static'];
module.exports = auth( [
    auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
] );
