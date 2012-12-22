var auth = require('connect-auth');
var nonLoginPaths = {
//  "/login": true,
  "/favicon.ico": true
};
const google2CallbackAddress = "http://business-game.kbsbng.com/oauth2callback";

var nonLoginPatterns = ['^/combo~', '^/static'];
module.exports = auth( {strategies: [
    auth.Google2({appId : process.env.google2id, appSecret: process.env.google2secret, requestEmailPermission: true, callback: google2CallbackAddress})
],trace: true });
