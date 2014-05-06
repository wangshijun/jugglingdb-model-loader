function BaseError (msg, constr) {
    Error.captureStackTrace(this, constr || this);
    this.message = msg || 'Error';
}

BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.name = 'Base Error';
BaseError.constructor = BaseError;
BaseError.__super__ = Error.prototype;
BaseError.extend = require('../mixin/extend.fn.js');

module.exports = BaseError;
