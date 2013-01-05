/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Game', function(Y, NAME) {
    var utils = Y.mojito.businessGameUtils;

    /**
     * The Game module.
     *
     * @module Game
     */

    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.namespace('mojito.controllers')[NAME] = {

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function(ac) {
            ac.assets.addCss('./index.css');
            ac.done({
                status: 'Mojito is working.',
                data: data
            });
        },

        addnewgame: function(ac) {
            var model = ac.models.get('GameModel');
            console.log("Params: ");
            console.log(ac.params.getFromUrl());
            model.newGame(utils.getUserEmail(ac), ac.params.getFromUrl(), function(err, result) {
                ac.http.getResponse().setHeader('Content-Type', 'application/json');
                // XXX: fix this later
                ac.http.redirect('/', 303);
                if (err) {
                    Y.log("error: " + err, "error", NAME);
                    //ac.error(JSON.stringify(err));
                    return;
                }
                Y.log("Added new game", "debug", NAME);
                //ac.done(JSON.stringify(result));
            });
        },

        deletegame: function(ac) {
            var model, params, redirect;
            model = ac.models.get('GameModel');
            params = ac.params.getFromUrl();
            console.log("Params: ");
            console.log(params);
            model.deleteGame(params, function(err, result) {
                if (params.redirect) {
                    ac.http.redirect('/', 303);
                    return;
                }

                if (err) {
                    Y.log("error: " + err, "error", NAME);
                    ac.done(JSON.stringify(err));
                    return;
                }
                Y.log("Deleted game", "debug", NAME);
                ac.done(JSON.stringify(result));
            });
        },

        deleteuser: function(ac) {
            var model = ac.models.get('GameModel');
            model.deleteUser(utils.getUserEmail(ac), function(err, result) {
                ac.done("Done deleting " + result);
            });
        },

        joingame: function(ac) {
            var model, params;
            params = ac.params.getFromUrl();
            model = ac.models.get('GameModel');
            model.addPlayerToGame(utils.getUserEmail(ac), params.gameId, function(err, game) {
                if (err) {
                    Y.log("error: " + err, "error", NAME);
                    ac.done(JSON.stringify(err));
                    return;
                }
                ac.http.getResponse().setHeader('Content-Type', 'application/json');
                ac.done(JSON.stringify({status: "Success"}));
            });
        }

    };

}, '0.0.1', {
    requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'GameModel', 'business-game-util', 'mojito-http-addon', 'mojito-params-addon']
});
