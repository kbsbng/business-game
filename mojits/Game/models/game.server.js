/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('GameModel', function (Y, NAME) {
    var mongo, db, users, games;
    mongo = require('mongoskin');
    db = mongo.db(process.env.MONGOHQ_URL, {
        //database: 'app10104342',
        safe: true
        //username: process.env.MONGOHQ_USERNAME,
        //password: process.env.MONGOHQ_PASSWORD
    });
    users = db.collection('users');
    games = db.collection("games");

    Y.namespace('mojito.models')[NAME] = {

        init: function (config) {
            this.config = config;
        },

        ensureUserExists: function (user, cb) {
            if (cb === undefined) {
                cb = function () {
                    //Y.log(result, "debug", NAME);
                };
            }
            Y.log("Ensuring that user " + user.email + " with name " + user.name + " exists", "info", NAME);
            users.update({
                "_id": user.email
            }, {
                "$set": {
                    "name": user.name
                }
            }, {
                upsert: true
            }, function (err, result) {
                if (err != null) {
                    Y.log(err, "error", NAME);
                }
                cb(err, result);
            });
        },

        _getNewGameId: function (userId) {
            var gameId, creationTime;
            creationTime = new Date().getTime();
            gameId = creationTime + "-" + userId;
            return {
                id: gameId,
                creationTime: creationTime
            };
        },

        newGame: function (userId, params, cb) {
            if (cb === undefined) {
                cb = function () {
                    //Y.log(result, "debug", NAME);
                };
            }
            var gameId;
            gameId = this._getNewGameId(userId);
            games.insert({
                "_id": gameId.id,
                players: [userId],
                creator: userId,
                status: "Awaiting Players",
                name: params['game-name'],
                numPlayers: params['num-players'],
                creationTime: gameId.creationTime
            }, function (err, result) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, result);
                    return;
                }
                users.update({
                    "_id": userId
                }, {
                    "$push": {
                        games: gameId.id
                    }
                }, function (err, result) {
                    if (err) {
                        Y.log(err, "error", NAME);
                        cb(err, result);
                        return;
                    }
                    cb(null, {
                        gameId: gameId.id
                    });
                });
            });
        },

        deleteGame: function (params, cb) {
            games.remove({
                "_id": params.gameId
            }, {
                safe: true
            }, function (err, count) {
                if (err) {
                    cb(err, count);
                    return;
                }
                if (count === 0) {
                    cb({
                        error: "Game not found"
                    });
                    return;
                }
                Y.log("Removed " + count + " game object from db with id " + params.gameId, "info", NAME);
                users.update({
                    games: params.gameId
                }, {
                    "$pop": {
                        "games": params.gameId
                    }
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        Y.log(err, "error", NAME);
                        cb(err, result);
                        return;
                    }
                    cb(err, {
                        status: "Deleted game"
                    });
                });
            });
        },

//        getGameStatus: function(gameId, cb) {
//            games.findOne({
//                "_id": gameId
//            }, ["players", "numPlayers"], function(err, game) {
//                if (err) {
//                    Y.log(err, "error", NAME);
//                    cb(err, game);
//                    return;
//                }
//                cb(err, game);
//            });
//        },

        setGameStatusToInProgress: function (gameId, gameObj, cb) {
            Y.log("Setting status of gameid " + gameId + " to " + "In Progress", "debug", NAME);
            var newSettings;
            newSettings = {};
            newSettings.status = "In Progress";
            newSettings.turn = gameObj.players[0];
            gameObj.players.forEach(function (player) {
                player = player.replace(/\./g, "(");
                newSettings['playerStatus.' + player +'.status'] = "Playing";
            });
            games.findAndModify({
                "_id": gameId
            }, [
                ['_id', 'asc']
            ], {
                "$set": newSettings
            }, {
                safe: true,
                new: true
            }, function (err, game) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                Y.log("Game after setting: ", "debug", NAME);
                Y.log(game, "debug", NAME);
                cb(err, game);
            });
        },
        setGameStatusToOver: function (gameId, winner, cb) {
            Y.log("Setting status of gameid " + gameId + " to " + "In Progress", "debug", NAME);

            games.findAndModify({
                "_id": gameId
            }, [
                ['_id', 'asc']
            ], {
                "$set": {
                    "status": "Over",
                    "winner": winner
                }
            }, function (err, game) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                cb(err, game);
            });
        },
        addPlayerToGame: function (userId, gameId, cb) {
            var me = this;
            games.findAndModify({
                "_id": gameId
            }, [
                ['_id', 'asc']
            ], {
                $push: {
                    players: userId
                }
            }, {
                safe: true,
                new: true
            }, function (err, game) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                Y.log("Players.length: " + game.players.length + " Players: " + game.players + " numplayers: " + game.numPlayers, "debug", NAME);
                if (game.players.length == game.numPlayers) {
                    me.setGameStatusToInProgress(gameId, game, cb);
                    return;
                }
                cb(err, game);
            });
        },

        getUsers: function (playerIds, cb) {
            users.find({
                "_id": {
                    "$in": Object.keys(playerIds)
                }
            }).toArray(function (error, users) {
                    if (error) {
                        Y.log(error, "error", NAME);
                        cb({});
                        return;
                    }
                    var usersObj = {};
                    users.forEach(function (e) {
                        usersObj[e._id] = e;
                    });
                    Y.log("Users", "debug", NAME);
                    Y.log(usersObj, "debug", NAME);
                    cb({
                        users: usersObj
                    });
                });
        },

        getUsersForGames: function (games, cb) {
            var playerIds = {};
            games.forEach(function (game) {
                game.playerIds = {};
                game.players.forEach(function (player) {
                    playerIds[player] = 1;
                    game.playerIds[player] = 1;
                });
            });
            this.getUsers(playerIds, function (data) {
                data.games = games;
                cb(data);
            });
        },

        getGamesForUser: function (userId, cb) {
            var me = this;
            games.find({
                players: {
                    "$all": [userId]
                }
            }).toArray(function (err, gs) {
                    if (err) {
                        Y.log(err, "error", NAME);
                        cb({
                            games: []
                        });
                        return;
                    }
                    if (!gs) {
                        cb({
                            games: []
                        });
                        return;
                    }
                    Y.log(gs, "debug", NAME);
                    me.getUsersForGames(gs, cb);
                });
        },

        getOpenGames: function (cb) {
            var me = this;
            games.find({
                status: "Awaiting Players"
            }).toArray(function (error, games) {
                    if (error) {
                        Y.log(error, "error", NAME);
                        cb({games: []});
                        return;
                    }
                    me.getUsersForGames(games, cb);
                });
        },

        deleteUser: function (userId, cb) {
            users.remove({
                "_id": userId
            }, {
                safe: true
            }, function (err, count) {
                if (err) {
                    cb(err, count);
                    return;
                }
                cb(err, count);
            });
        },

        getGameDetails: function (gameId, cb) {
            var me = this;
            games.findOne({"_id": gameId}, function (err, game) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                var playerIds = {};
                game.playerIds = {};
                game.players.forEach(function (player) {
                    playerIds[player] = 1;
                    game.playerIds[player] = 1;
                });
                me.getUsers(playerIds, function (data) {
                    data.game = game;
                    cb(err, data);
                });
            });
        },

        resignGame: function (userId, gameId, cb) {
            var me, newSetting, userIdx;
            me = this;
            newSetting = {
            };
            userIdx = userId.replace(/\./g, "(");
            newSetting['playerStatus.' + userIdx + '.status'] = 'Resigned';
            games.findAndModify({
                "_id": gameId
            }, [
                ['_id', 'asc']
            ], {
                "$set": newSetting
            }, {
                safe: true,
                new: true
            }, function (err, game) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                var numPlaying = 0, winnerCandidate = null;
                Y.log("Game after resigning: ", "debug", NAME);
                Y.log(game, "debug", NAME);
                game.players.forEach(function (player) {
                    var playerIdx;
                    playerIdx = player.replace(/\./g, "(");
                    if (game.playerStatus[playerIdx].status == "Playing") {
                        numPlaying++;
                        winnerCandidate = player;
                    }
                });
                if (numPlaying == 1) {
                    me.setGameStatusToOver(gameId, winnerCandidate, cb);
                    return;
                }
                cb(err, game);
            });

        }
    };
}, '0.0.1', {
    requires: []
});
