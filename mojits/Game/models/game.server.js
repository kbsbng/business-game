/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/
YUI.add('GameModel', function (Y, NAME) {
    var mongo, db, users, games, places, placesInfo, TURN_TO;
    mongo = require('mongoskin');
    //noinspection JSUnresolvedVariable
    db = mongo.db(process.env.MONGOHQ_URL, {
        safe: true
    });
    users = db.collection('users');
    games = db.collection("games");

    places = [
        "Start",
        "Bangalore",
        "New York",
        "Paris",
        "Luck",
        "Cairo",
        "Melbourne",
        "Pune",
        "Jail",
        "Chennai",
        "California",
        "London",
        "Luck",
        "Cape Town",
        "Ottawa",
        "Sydney",
        "Resort",
        "Kolkata",
        "Texas",
        "Perth",
        "Moscow",
        "Lagos",
        "Canberra",
        "Madrid",
        "Club Party",
        "Algiers",
        "New Delhi",
        "Mexico City",
        "Luck",
        "Frankfurt",
        "Alexandria",
        "Wellington"
    ];

    placesInfo = {
        "Start": {
            "type": "start"
        },
        "Bangalore": {
            "type": "place",
            "color": "orange",
            "rent": {
                "site": 400,
                "house": 1000,
                "hotel": 2000
            },
            "cost": {
                "site": 4000,
                "house": 8000,
                "hotel": 8000
            }
        },
        "New York": {
            "type": "place",
            "color": "magenta",
            "rent": {
                "site": 800,
                "house": 2000,
                "hotel": 4000
            },
            "cost": {
                "site": 8000,
                "house": 10000,
                "hotel": 10000
            }
        },
        "Paris": {
            "type": "place",
            "color": "blue",
            "rent": {
                "site": 200,
                "house": 800,
                "hotel": 1000
            },
            "cost": {
                "site": 2000,
                "house": 4000,
                "hotel": 4000
            }
        },
        "Cairo": {
            "type": "place",
            "color": "green",
            "rent": {
                "site": 100,
                "house": 400,
                "hotel": 800
            },
            "cost": {
                "site": 800,
                "house": 2000,
                "hotel": 2000
            }
        },
        "Melbourne": {
            "type": "place",
            "color": "yellow",
            "rent": {
                "site": 500,
                "house": 2000,
                "hotel": 4000
            },
            "cost": {
                "site": 3500,
                "house": 7500,
                "hotel": 7500
            }
        },
        "Pune": {
            "type": "place",
            "color": "orange",
            "rent": {
                "site": 300,
                "house": 750,
                "hotel": 1800
            },
            "cost": {
                "site": 3000,
                "house": 6500,
                "hotel": 6500
            }
        },
        "Jail": {
            type: "jail"
        },
        "Chennai": {
            type: "place",
            "color": "orange",
            "rent": {
                "site": 350,
                "house": 900,
                "hotel": 1700
            },
            "cost": {
                "site": 3500,
                "house": 7500,
                "hotel": 7500
            }
        },
        "California": {
            type: "place",
            "color": "magenta",
            "rent": {
                "site": 700,
                "house": 1800,
                "hotel": 3600
            },
            "cost": {
                "site": 7500,
                "house": 8000,
                "hotel": 8000
            }
        },
        "London": {
            type: "place",
            "color": "blue",
            "rent": {
                "site": 500,
                "house": 2000,
                "hotel": 4000
            },
            "cost": {
                "site": 3500,
                "house": 7500,
                "hotel": 7500
            }
        },
        "Cape Town": {
            type: "place",
            color: "blue",
            "rent": {
                "site": 400,
                "house": 1500,
                "hotel": 3000
            },
            "cost": {
                "site": 4000,
                "house": 4500,
                "hotel": 4500
            }
        },
        "Ottawa": {
            type: "place",
            "color": "magenta",
            "rent": {
                "site": 700,
                "house": 1800,
                "hotel": 3600
            },
            "cost": {
                "site": 7500,
                "house": 8000,
                "hotel": 8000
            }
        },
        "Sydney": {
            type: "place",
            color: "yellow",
            "rent": {
                "site": 600,
                "house": 2300,
                "hotel": 3800
            },
            "cost": {
                "site": 3900,
                "house": 7800,
                "hotel": 7800
            }
        },
        "Resort": {
            type: "resort"
        },
        "Kolkata": {
            type: "place",
            "color": "orange",
            "rent": {
                "site": 200,
                "house": 400,
                "hotel": 1000
            },
            "cost": {
                "site": 800,
                "house": 1500,
                "hotel": 1500
            }
        },
        "Texas": {
            type: "place",
            color: "magenta",
            "rent": {
                "site": 600,
                "house": 2400,
                "hotel": 3900
            },
            "cost": {
                "site": 4000,
                "house": 7900,
                "hotel": 7900
            }
        },
        "Perth": {
            type: "place",
            color: "yellow",
            "rent": {
                "site": 400,
                "house": 900,
                "hotel": 1600
            },
            "cost": {
                "site": 1200,
                "house": 2400,
                "hotel": 2400
            }
        },
        "Moscow": {
            type: "place",
            "color": "blue",
            "rent": {
                "site": 400,
                "house": 800,
                "hotel": 1200
            },
            "cost": {
                "site": 1000,
                "house": 2500,
                "hotel": 2500
            }
        },
        "Lagos": {
            type: "place",
            "color": "green",
            "rent": {
                "site": 100,
                "house": 400,
                "hotel": 800
            },
            "cost": {
                "site": 700,
                "house": 1500,
                "hotel": 1500
            }
        },
        "Canberra": {
            type: "place",
            color: "yellow",
            "rent": {
                "site": 800,
                "house": 2400,
                "hotel": 3000
            },
            "cost": {
                "site": 3600,
                "house": 7000,
                "hotel": 7000
            }
        },
        "Madrid": {
            type: "place",
            "color": "blue",
            "rent": {
                "site": 200,
                "house": 700,
                "hotel": 1100
            },
            "cost": {
                "site": 800,
                "house": 1200,
                "hotel": 1200
            }
        },
        "Club Party": {
            type: "club"
        },
        "Algiers": {
            type: "place",
            "color": "green",
            "rent": {
                "site": 400,
                "house": 1000,
                "hotel": 1500
            },
            "cost": {
                "site": 900,
                "house": 1900,
                "hotel": 1900
            }
        },
        "New Delhi": {
            type: "place",
            "color": "orange",
            "rent": {
                "site": 600,
                "house": 1200,
                "hotel": 2300
            },
            "cost": {
                "site": 4500,
                "house": 8500,
                "hotel": 8500
            }
        },
        "Mexico City": {
            type: "place",
            "color": "magenta",
            "rent": {
                "site": 500,
                "house": 950,
                "hotel": 1750
            },
            "cost": {
                "site": 2150,
                "house": 4000,
                "hotel": 4000
            }
        },
        "Luck": {
            type: "luck"
        },
        "Frankfurt": {
            type: "place",
            "color": "blue",
            "rent": {
                "site": 400,
                "house": 1400,
                "hotel": 2500
            },
            "cost": {
                "site": 1500,
                "house": 3000,
                "hotel": 3000
            }
        },
        "Alexandria": {
            type: "place",
            "color": "green",
            "rent": {
                "site": 300,
                "house": 800,
                "hotel": 1500
            },
            "cost": {
                "site": 800,
                "house": 2000,
                "hotel": 2000
            }
        },
        "Wellington": {
            type: "place",
            "color": "yellow",
            "rent": {
                "site": 400,
                "house": 1200,
                "hotel": 2000
            },
            "cost": {
                "site": 1800,
                "house": 2900,
                "hotel": 2900
            }
        }
    };

    TURN_TO = {};
    Object.defineProperty(TURN_TO, "PLAY", {
        value: "play",
        enumerable: true,
        writable: false,
        configurable: false
    });
    Object.defineProperty(TURN_TO, "CHOOSE", {
        value: "choose",
        enumerable: true,
        writable: false,
        configurable: false
    });

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
                if (err !== null) {
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
            var newSettings, colors;
            colors = ["blue", "red", "yellow", "orange"];
            newSettings = {};
            newSettings.status = "In Progress";
            newSettings.turn = gameObj.players[0];
            newSettings.turnTo = TURN_TO.PLAY;
            newSettings.turnIdx = 0;
            gameObj.players.forEach(function (player, i) {
                player = player.replace(/\./g, "(");
                newSettings['playerStatus.' + player + '.status'] = "Playing";
                newSettings['playerStatus.' + player + '.money'] = 25000;
                newSettings['playerStatus.' + player + '.position'] = 0;
                newSettings['playerStatus.' + player + '.color'] = colors[i];
            });
            newSettings['positionStatus.0.players'] = gameObj.players;
            games.findAndModify({
                "_id": gameId
            }, [
                ['_id', 'asc']
            ], {
                "$set": newSettings
            }, {
                safe: true,
                "new": true
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
                "new": true
            }, function (err, game) {
                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                Y.log("Players.length: " + game.players.length + " Players: " + game.players + " numplayers: " + game.numPlayers, "debug", NAME);
                if (game.players.length === game.numPlayers) {
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
            }).toArray(
                function (error, users) {
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
                }
            );
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
            }).toArray(
                function (err, gs) {
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
                }
            );
        },

        getOpenGames: function (cb) {
            var me = this;
            games.find({
                status: "Awaiting Players"
            }).toArray(
                function (error, games) {
                    if (error) {
                        Y.log(error, "error", NAME);
                        cb({games: []});
                        return;
                    }
                    me.getUsersForGames(games, cb);
                }
            );
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
                    Y.log(playerIds, "debug", NAME);
                    data.game = game;
                    data.places = places;
                    data.placesInfo = placesInfo;
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
                "new": true
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
                    if (game.playerStatus[playerIdx].status === "Playing") {
                        numPlaying = numPlaying + 1;
                        winnerCandidate = player;
                    }
                });
                if (numPlaying === 1) {
                    me.setGameStatusToOver(gameId, winnerCandidate, cb);
                    return;
                }
                cb(err, game);
            });

        },

        payRent: function (game, tenant, owner, newPosition, type, gameUpdate) {
            var tenantIdx, ownerIdx, rent, place;
            tenantIdx = tenant.replace(/\./g, "(");
            ownerIdx = owner.replace(/\./g, "(");
            place = places[newPosition];
            rent = placesInfo[place].rent[type];
            gameUpdate.$set['playerStatus.' + tenantIdx + '.money'] = game.playerStatus[tenantIdx].money - rent;
            gameUpdate.$set['playerStatus.' + ownerIdx + '.money'] = game.playerStatus[ownerIdx].money + rent;
        },

        rotateTurn: function (game, gameUpdate) {
            gameUpdate.$set.turnIdx = (game.turnIdx + 1) % game.numPlayers;
            gameUpdate.$set.turn = game.players[gameUpdate.$set.turnIdx];
            gameUpdate.$set.turnTo = TURN_TO.PLAY;
        },

        throwDice: function (userId, gameId, cb) {
            var me = this;

            games.findOne({"_id": gameId}, ["turn", "turnIdx", "numPlayers", "playerStatus", "positionStatus", "players"], function (err, game) {
                var dice1, dice2, playerIdx, newPosition, oldPosition, gameUpdate, owner;

                function updateGame() {
                    games.findAndModify({
                        "_id": gameId
                    }, [
                        ['_id', 'asc']
                    ], gameUpdate, {
                        safe: true,
                        "new": true
                    }, function (err, newGame) {
                        if (err) {
                            Y.log(err, "error", NAME);
                            cb(err, newGame);
                            return;
                        }
                        Y.log("Game after updating in throwDice: ", "debug", NAME);
                        Y.log(game, "debug", NAME);
                        cb(err, {
                            dice1: dice1,
                            dice2: dice2
                        });
                    });
                }

                if (err) {
                    Y.log(err, "error", NAME);
                    cb(err, game);
                    return;
                }
                if (game.turn !== userId) {
                    cb({error: "This is not your turn to play!"}, game);
                    return;
                }
                dice1 = Math.round(Math.random() * 6);
                dice2 = Math.round(Math.random() * 6);
                playerIdx = userId.replace(/\./g, "(");
                oldPosition = game.playerStatus[playerIdx].position;
                newPosition = (oldPosition + dice1 + dice2) % 32;
                gameUpdate = {
                    '$pull': {},
                    '$push': {},
                    '$set': {}
                };
                gameUpdate.$pull['positionStatus.' + oldPosition + '.players'] = userId;
                gameUpdate.$push['positionStatus.' + newPosition + '.players'] = userId;
                gameUpdate.$set['playerStatus.' + playerIdx + '.position'] = newPosition;

                owner = game.positionStatus[newPosition].owner;
                if (owner) {
                    if (owner !== userId) {
                        me.payRent(game, userId, owner, newPosition, game.positionStatus[newPosition].construction, gameUpdate);
                    }
                    me.rotateTurn(game, gameUpdate);
                    updateGame();
                    return;
                }
                gameUpdate.$set.turnTo = TURN_TO.CHOOSE;
                updateGame();
            });

        }
    };
}, '0.0.1', {
    requires: []
});
