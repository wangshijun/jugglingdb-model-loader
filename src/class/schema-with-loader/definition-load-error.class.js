var BaseError = require('../../../lib/class/error.class.js');

var DefinitionLoadError = BaseError.extend({
    constructor : function DefinitionLoadError (msg) {
        BaseError.call(this, msg, this.constructor);
    },
    message : 'Definition Load Error'
});

module.exports = DefinitionLoadError;
