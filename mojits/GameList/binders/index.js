/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameListBinderIndex', function(Y, NAME) {
    testY = Y;

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

        sendAction: function(action, id, successCb, failureCb) {
            Y.io("/game/action/" + action + "?gameId=" + id, {
                //                method : "POST",
                //                data : {gameId:id},
                on: {
                    success: function(id, o, args) {
                        console.log("success");
                        Y.log(o);
                        Y.log(args);
                        Y.one("#game-list-action-status").set('text', o.responseText);
                        successCb();
                        //document.location.reload();
                    },
                    failure: function(id, o, args) {
                        console.log("failure.. ");
                        Y.log("Response: " + o.responseText);
                    }
                },
                context: this //,
                //               headers : {
                //                    'Content-type' : 'application/javascript'
                //              }
            });
        },

        playHandler: function(id, target) {
            window.location.href = "/game/action/play?gameId=" + id;
        },

        deleteHandler: function(id, target) {
            this.sendAction('delete', id, function() {
                target.remove();
            });
        },

        getElIdFromGameId : function(id) {
            return "game-list-" + id;
        },

        getGameIdFromElId : function(id) {
            return id.replace("game-list-", "");
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
            node.all('.action-button').on('click', function(e) {
                var action, elId, gameId, targetGame;
                targetGame = e.target.ancestor("tr");
                elId = targetGame.get("id");
                gameId = me.getGameIdFromElId(elId);

                action = e.target.get('value');
                action = action.toLowerCase().replace(/ /g, "-");
                Y.log(action + " action called for " + gameId);
                me[action + 'Handler'](gameId, targetGame);
            });
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

}, '0.0.1', {
    requires: ['event-mouseenter', 'mojito-client', 'io-base']
});
