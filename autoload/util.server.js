YUI.add('business-game-util', function(Y) {
    const mockUserData = {
        "1" : {name: "Keshavaprasad B S", email: "kbsbng@gmail.com"},
        "2" :  {name: "Smitha", email: "smitha.srikumar1@gmail.com"}
    };
    var fs;
    fs = require("fs");
    Y.mojito.businessGameUtils = {
        getUserName : function(ac) {
            return this.getUserObj(ac).name;
        },
        getUserEmail : function(ac) {
            return this.getUserObj(ac).email;
        },
        getUserObj : function(ac) {
            if (process.env.ENV == "dev") {
                var user = fs.readFileSync("./userData.txt").toString();
                return mockUserData[user];
            }
            return ac._adapter.req.getAuthDetails().user;
        }
    };
}, '0.0.1', {
    requires : ['mojito-params-addon']
});
