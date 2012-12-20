/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Hello', function (Y, NAME) {

    /**
     * The Hello module.
     *
     * @module Hello
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
            ac.models.get('HelloModelFoo').getData(function (err, data) {
                if (err) {
                    ac.error(err);
                    return;
                }
                ac.assets.addCss('./index.css');
                var facebook = ac._adapter.req.facebook;
                facebook.app(function (app) {
                    facebook.me(function (user) {
                        ac.done({
                        status: 'Mojito is working.' + JSON.stringify(ac._adapter.req.facebook) + "result: " + JSON.stringify(user),
                        data: data
                    });
                    });
                });


            });
        }

    };

}, '0.0.1', {
    requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'HelloModelFoo']
});