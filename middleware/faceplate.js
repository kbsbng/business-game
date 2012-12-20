var url = require('url');
var nonLoginPaths = {
    "/login": true,
    "/favicon.ico": true
};

var nonLoginPatterns = ['^/combo~', '^/static'];
module.exports = require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_SECRET,
    scope:  'publish_stream'
});