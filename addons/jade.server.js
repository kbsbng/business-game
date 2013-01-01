YUI.add('addons-viewengine-jade', function(Y, NAME) {
    var fs, jade, compiledTemplates;
    fs = require('fs');
    jade = require('jade');
    function JadeAdapter(viewId) {
        this.viewId = viewId;
    };
    compiledTemplates = {};

    JadeAdapter.prototype = {
        render: function(data, mojitType, tmpl, adapter, meta, more) {
            var compiledTmpl = compiledTemplates[tmpl];
            data.meta = meta.view;
            if (compiledTmpl === undefined) {
                this.compileAsync(tmpl, function(compiledTmpl) {
                    compiledTemplates[tmpl] = compiledTmpl;
                    adapter.done(compiledTmpl(data), meta);
                });
                return;
            }
            adapter.done(compiledTmpl(data), meta);
        },
        compiler: function(tmpl) {
            Y.log("jade compiler called", "debug", NAME);
            return jade.compile(fs.readFileSync(tmpl, 'utf8'), {filename : tmpl});
            //return fs.readFileSync(tmpl, 'utf8');
        },
        compileAsync: function(tmpl, cb) {
            Y.log("Asynchrounous compile for jade tmpl called", "debug", NAME);
            fs.readFile(tmpl, 'utf-8', function(err, data) {
                if (err) {
                    throw err;
                }
                cb(jade.compile(data, {filename : tmpl}));
            });
        }
    };
    Y.namespace('mojito.addons.viewEngines').jade = JadeAdapter;
}, '0.1.0', {requires: []});
