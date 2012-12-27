/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameModel', function(Y, NAME) {
    var url, mongo, db, users, games;
    url = require("url");
    mongo = require('mongoskin');
    db = mongo.db(process.env.MONGOHQ_URL);
    users = db.collection('users');
    games = db.collection("games");

    Y.namespace('mojito.models')[NAME] = {

        init: function(config) {
            this.config = config;
        },

        ensureUserExists: function(userId, cb) {
            Y.log("Ensuring that user " + userId + " exists");
            users.insert({"_id" : userId}, function(err, result) {
                if (err != null) {
                    Y.log(err, "error", NAME);
                }
                cb(err, result);
            });
        },

        _getNewGameId : function(userId) {
            var gameId, creationTime;
            creationTime = new Date().getTime();
            gameId = creationTime + "-" + userId;
            return {id:gameId, creationTime:creationTime};
        },

        newGame : function(userId, cb) {
            var gameId;
            gameId = this._getNewGameId(userId);
            games.insert({"_id" : gameId.id, players : [ userId ], creationTime : gameId.creationTime}, function(err, result) {
                if (err !== null) {
                    Y.log(err, "error", NAME);
                    cb(err, result);
                    return;
                }
                users.update({"_id" : userId}, {"$push" : {games : gameId.id}}, function(err, result) {
                    if (err != null) {
                        Y.log(err, "error", NAME);
                    }
                    cb(err, result);
                });
            });
        },

        addPlayerToGame : function(userId, gameId) {
            games.update({"_id" : gameId}, {$push:{players: userId}});
        }


    };

}, '0.0.1', {requires: []});
