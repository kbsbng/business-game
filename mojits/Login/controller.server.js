/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Login', function (Y, NAME) {

    /**
     * The Login module.
     *
     * @module Login
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
        index: function (ac) {
            var facebook = ac._adapter.req.facebook;
            facebook.app(function (app) {
                facebook.me(function (user) {
                    console.log(user);
                    ac.done({
                        layout: false,
                        req: ac._adapter.req,
                        app: app,
                        user: user
                    });
                });
            });
        }

    };

}, '0.0.1', {
    requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'LoginModelFoo']
});
