/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*global YUI*/
/*global YUITest*/
YUI.add('GameModel-tests', function (Y, NAME) {
    'use strict';
    var suite = new YUITest.TestSuite(NAME),
        model = null,
        A = YUITest.Assert,
        mongo = require('mongoskin'),
        games,
        users,
        db;
    db = mongo.db(process.env.MONGOHQ_URL, {
        safe: true
    });
    users = db.collection('users');
    games = db.collection("games");

    suite.add(new YUITest.TestCase({

        name: 'GameModel user tests',

        setUp: function () {
            console.log("Setting up test");
            model = Y.mojito.models.GameModel;
        },
        tearDown: function () {
            console.log("tear down test");
            model = null;
        },

        'test ensureUserExists': function () {
            var me = this;
            model.ensureUserExists({email: "user@domain.com", name: "Test user"}, function (err, result) {
                me.resume(function () {
                    A.isNull(err, "assert that err is null");
                    A.areSame(1, result, "test ensureUserexists result");
                });
            });
            this.wait();
        }


//        'test throwDice': function () {
//            var called = false,
//                cfg = { color: 'red' };
//
//            A.isNotNull(model);
//
//            A.isFunction(model.init);
//            model.init(cfg);
//            A.areSame(cfg, model.config);
//
//            A.isFunction(model.getData);
//            model.throwDice("user@domain.com", function (err, data) {
//                called = true;
//                A.isTrue(!err);
//                A.isObject(data);
//                A.areSame('data', data.some);
//            });
//            A.isTrue(called);
//        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: ['mojito-test', 'GameModel']});
