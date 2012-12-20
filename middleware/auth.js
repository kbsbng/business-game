var url = require('url');
var nonLoginPaths = {
  "/login": true,
  "/favicon.ico": true
};

var nonLoginPatterns = ['^/combo~', '^/static'];
module.exports = function (req, res, next) {
  var i, parsedUrl;
  parsedUrl = url.parse(req.url);
  if (nonLoginPaths[parsedUrl.pathname] === true) {
    return next();
  }
  for (i = 0; i < nonLoginPatterns.length; i++) {
    if (parsedUrl.pathname.match(nonLoginPatterns[i]) !== null) {
      return next();
    }
  }

  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      if (!user) {
        console.log("Facebook token not found: " + req.url);
        req.url = "/login";
      }
      else {
        console.log("Facebook token found: " + req.url);
      }
      return next();
    });
  });
};