YUI.add('business-game-util', function(Y) {
    Y.mojito.businessGameUtils = {
        getUserName : function(ac) {
            return this.getUserObj(ac).name;
        },
        getUserEmail : function(ac) {
            return this.getUserObj(ac).email;
        },
        getUserObj : function(ac) {
            if (process.env.ENV == "dev") {
                if (ac.params.getFromUrl().user == 2) {
                    return {name: "Smitha", email: "smitha.srikumar1@gmail.com"};
                }
                return {name: "Keshavaprasad B S", email: "kbsbng@gmail.com"};
            }
            return ac._adapter.req.getAuthDetails().user;
        }
    };
}, '0.0.1', {
    requires : ['mojito-params-addon']
});
