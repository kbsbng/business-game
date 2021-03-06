/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('OpenGamesBinderIndex', function(Y, NAME) {

/**
 * The OpenGamesBinderIndex module.
 *
 * @module OpenGamesBinderIndex
 */

    /**
     * Constructor for the OpenGamesBinderIndex class.
     *
     * @class OpenGamesBinderIndex
     * @constructor
     */
    Y.namespace('mojito.binders')[NAME] = {

        sendAction : function(action, id) {
            action = action.toLowerCase().replace(/ /g, "-");
            Y.io("/game/action/" + action + "?gameId=" + id, {
//                method : "POST",
//                data : {gameId:id},
                on : {
                    success : function(id, o, args) {
                        console.log("success");
                        Y.log(o);
                        Y.one("#action-status").set('text', o.responseText);
                        document.location.reload();
                    },
                    failure : function(id, o, args) {
                        console.log("failure.. ");
                        Y.log("Response: " + o.responseText);
                    }
                },
                context : this//,
 //               headers : {
//                    'Content-type' : 'application/javascript'
  //              }
            });
        },

        /**
         * Binder initialization method, invoked after all binders on the page
         * have been constructed.
         */
        init: function(mojitProxy) {
            this.mojitProxy = mojitProxy;
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
            node.all('.join-game-button').on('click', function(e) {
                testE = e;
                var action, id;
                id = e.target.ancestor("tr").get("id");
                action = e.target.get('value');
                Y.log(action + " action called for " + id);
                me.sendAction(action, id);
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

}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
