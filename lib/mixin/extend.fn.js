// basically a copy of the Backbone.js implementation of a class extension.
var Object_create = Object.create,
    Object_keys   = Object.keys;

module.exports = function (instanceProperties, staticProperties) {
    var Parent = this,
        Child  = instanceProperties && instanceProperties.hasOwnProperty('constructor')
                    ? instanceProperties.constructor
                    : function () { return Parent.apply(this, arguments); },
        keys, key;

    // Have child inherit Parent
    Child.prototype = Object_create(Parent.prototype);
    // Set the inherited prototype's "constructor" property
    // to properly reflect the Child's constructor.
    Child.prototype.constructor = Child;

    // Add class instance properties if needed.
    if (instanceProperties) {
        keys = Object_keys(instanceProperties);
        while (key = keys.shift()) {
            Child.prototype[key] = instanceProperties[key];
        }
    }
    // Add static properties from Parent class to
    // Child class.
    keys = Object_keys(Parent);
    while (key = keys.shift()) {
        Child[key] = Parent[key];
    }
    // Add static properties if needed.
    if (staticProperties) {
        keys = Object_keys(instanceProperties);
        while (key = keys.shift()) {
            Child[key] = staticProperties[key];
        }
    }

    Child.__super__ = Parent.prototype;

    return Child;
};
