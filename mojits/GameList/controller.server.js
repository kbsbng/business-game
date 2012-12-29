/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameList', function(Y, NAME) {

    var utils = Y.mojito.businessGameUtils;
/**
 * The GameList module.
 *
 * @module GameList
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
            var userEmail, model;
            model = ac.models.get('GameModel');
            userEmail = utils.getUserEmail(ac);
            model.ensureUserExists({email : userEmail, name : utils.getUserName(ac)});
            model.getGamesForUser(userEmail, function(err, data) {
                if (err) {
                    Y.log(err, "error", NAME);
                    ac.error(err);
                    return;
                }
                ac.assets.addCss('./index.css');
                //Y.log(data, "debug", data);
                ac.done(data);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'GameListModelFoo', 'GameModel', 'business-game-util']});
