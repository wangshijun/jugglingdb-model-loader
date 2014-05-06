var JugglingDB = require('jugglingdb');

JugglingDB.Schema.extend = require('../../lib/mixin/extend.fn.js');

var SchemaWithLoader = JugglingDB.Schema.extend({
    _modelLoader : require('./schema-with-loader/model-loader.class.js'),
    constructor : function (adapter, settings) {
        this._modelLoader = (settings && settings.modelLoader)
                                ? new this._modelLoader(settings.modelLoader)
                                : new this._modelLoader();

        JugglingDB.Schema.apply(this, arguments);
    },
    loadDefinition : function (modelName) {
        return this._modelLoader.load(this,modelName);
    }
});

module.exports = SchemaWithLoader;
