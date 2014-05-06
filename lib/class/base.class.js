function BaseClass () {}
BaseClass.__super__ = Object;
BaseClass.extend = require('../mixin/extend.fn.js');

module.exports = BaseClass;
