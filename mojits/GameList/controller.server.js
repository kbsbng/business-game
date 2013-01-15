/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameList', function(Y, NAME) {

    var utils = Y.mojito.businessGameUtils;
    var datetime = require('datetime');
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
            model.getGamesForUser(userEmail, function(data) {
                var actions = ac.config.getDefinition("actions");
                data.games.forEach(function(game){
                    var status = game.status ? game.status : "Awaiting Players";
                    game.actions = actions[status];
                });
                ac.assets.addCss('./index.css');
                //Y.log(data, "debug", data);
                data.datetime = datetime;
                ac.done(data);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'GameModel', 'business-game-util', 'mojito-config-addon', 'mojito-params-addon']});
