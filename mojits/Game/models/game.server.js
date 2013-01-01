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

        ensureUserExists: function(user, cb) {
            if (cb === undefined) {
                cb = function(err, result) {
                    Y.log(result, "debug", NAME);
                };
            }
            Y.log("Ensuring that user " + user.email + " with name " + user.name + " exists");
            users.update({"_id" : user.email},{ "$set" : {"name" : user.name}}, {upsert:true}, function(err, result) {
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

        newGame : function(userId, params, cb) {
            if (cb === undefined) {
                cb = function(err, result) {
                    Y.log(result, "debug", NAME);
                };
            }
            var gameId;
            gameId = this._getNewGameId(userId);
            games.insert({"_id" : gameId.id, players : [ userId ], creator : userId, status : "Awaiting Players", name : params['game-name'], numPlayers : params['num-players'], creationTime : gameId.creationTime}, function(err, result) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, result);
                    return;
                }
                users.update({"_id" : userId}, {"$push" : {games : gameId.id}}, function(err, result) {
                    if (err) {
                        Y.log(err, "error", NAME);
                        cb(err, result);
                        return;
                    }
                    cb(null, {gameId : gameId.id});
                });
            });
        },

        deleteGame: function(params, cb) {
            games.remove({"_id" : params.gameId}, {safe:true}, function(err, count) {
                if (err) {
                    cb(err, count);
                    return;
                }
                if (count === 0) {
                    cb({error : "Game not found"});
                    return;
                }
                Y.log("Removed " + count + " game object from db with id " + params.gameId);
                cb(err, {status : "Deleted game"});
                return;
            });
        },

        addPlayerToGame : function(userId, gameId) {
            games.update({"_id" : gameId}, {$push:{players: userId}});
        },

        getGamesForUser : function(userId, cb) {
            games.find({players : {"$all" : [userId]}}).toArray(function(err, games) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err);
                    return;
                }
                var playerIds = {};
                games.forEach(function(game) {
                    game.players.forEach(function(player) {
                        playerIds[player] = 1;
                    });
                });
                users.find({"_id" : {"$in" : Object.keys(playerIds)}}).toArray(function(error, users) {
                    if (error) {
                        Y.log(error, "error", NAME);
                        cb(error);
                        return;
                    }
                    Y.log(games, "debug", NAME);
                    var usersObj = {};
                    users.forEach(function(e) {
                        usersObj[e._id] = e;
                    });
                    Y.log(usersObj, "debug", NAME);
                    cb(error, {games : games, users : usersObj});
                });
            });
        }

    };

}, '0.0.1', {requires: []});
