YUI.add('business-game-util', function(Y) {
    Y.mojito.businessGameUtils = {
        getUserEmail : function(ac) {
            return this.getUserObj(ac).email;
        },
        getUserObj : function(ac) {
            return ac._adapter.req.getAuthDetails().user;
        }
    };
});
