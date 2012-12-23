/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameModel', function(Y, NAME) {


    Y.namespace('mojito.models')[NAME] = {

        init: function(config) {
            this.config = config;
        },

        getData: function(callback) {
            callback(null, { some: 'data' });
        }

    };

}, '0.0.1', {requires: []});
