/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('OpenGames', function(Y, NAME) {
    var utils = Y.mojito.businessGameUtils;
    var datetime = require('datetime');

/**
 * The OpenGames module.
 *
 * @module OpenGames
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
            ac.models.get('GameModel').getOpenGames(function(data) {
                ac.assets.addCss('./index.css');
                Y.log(data, "debug", NAME);
                data.user = utils.getUserObj(ac);
                data.datetime = datetime;
                ac.done(data);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'OpenGamesModelFoo', 'GameModel', 'mojito-params-addon']});
