/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Header', function(Y, NAME) {

    var utils = Y.mojito.businessGameUtils;
/**
 * The Header module.
 *
 * @module Header
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
                console.log(ac._adapter.req.getAuthDetails());
                ac.done({
                    user : utils.getUserObj(ac)
                });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'business-game-util']});
