/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameListBinderIndex', function(Y, NAME) {

/**
 * The GameListBinderIndex module.
 *
 * @module GameListBinderIndex
 */

    /**
     * Constructor for the GameListBinderIndex class.
     *
     * @class GameListBinderIndex
     * @constructor
     */
    Y.namespace('mojito.binders')[NAME] = {

        /**
         * Binder initialization method, invoked after all binders on the page
         * have been constructed.
         */
        init: function(mojitProxy) {
            this.mojitProxy = mojitProxy;
        },

        addNewGame : function() {
            Y.io("/game/addnewgame", {
                on : {
                    success : function(id, o, args) {
                        console.log("success");
                        Y.log(o);
                    },
                    failure : function(id, o, args) {
                        console.log("failure.. ");
                        Y.log("Response: " + o.responseText);
                    }
                },
                context : this,
                headers : {
                    'Content-type' : 'application/javascript'
                }
            });
        },

        /**
         * The binder method, invoked to allow the mojit to attach DOM event
         * handlers.
         *
         * @param node {Node} The DOM node to which this mojit is attached.
         */
        bind: function(node) {
            var me = this;
            this.node = node;
            node.one('#new-game-button').on('click', this.addNewGame);
            /**
             * Example code for the bind method:
             *
             * node.all('dt').on('mouseenter', function(evt) {
             *   var dd = '#dd_' + evt.target.get('text');
             *   me.node.one(dd).addClass('sel');
             *
             * });
             * node.all('dt').on('mouseleave', function(evt) {
             *   
             *   var dd = '#dd_' + evt.target.get('text');
             *   me.node.one(dd).removeClass('sel');
             *
             * });
             */
        }

    };

}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client', 'io-base']});
