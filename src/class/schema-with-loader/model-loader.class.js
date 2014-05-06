var path = require('path');
var util = require('util');

var BaseClass = require('../../../lib/class/base.class.js');
var DefinitionLoadError = require('./definition-load-error.class.js');

var __camelCaseToSlash = require('../../../lib/camelcase-to-slash.fn.js');
var __slashToCamelCase = require('../../../lib/slash-to-camelcase.fn.js');

var ModelLoader = BaseClass.extend({
    _rootDirectory          : path.dirname(require.main.filename),
    _defaultSearchDirectory : 'model-definition',
    _originalSearchDirectories : null,
    _directories            : null,
    _definitionExtension    : '.js',
    constructor : function (settings) {
        this._directories = [];
        this._originalSearchDirectories = [];
        if (settings) {
            if (settings.rootDirectory) {
                this.setRootDirectory(settings.rootDirectory);
            }
            this.addDirectory(settings.directory || settings.directories || this._defaultSearchDirectory);
        } else {
            this.addDirectory(this._defaultSearchDirectory);
        }
    },
    load : function (schema,modelName) {
        var model = schema.models && schema.models[modelName];
        if (!model) {
            var modelPathName = __camelCaseToSlash(modelName) + this._definitionExtension;
            var definitionModule;
            var fullPath;
            var failedPaths = [];
            for (var i = 0, L = this._directories.length; i < L; i+=1) {
                try {
                    fullPath = path.resolve(this._directories[i],modelPathName);
                    definitionModule = require(fullPath);
                } catch (e) {
                    failedPaths.push(fullPath);
                }
            }
            if (definitionModule) {
                model = definitionModule(schema);
            } else {
                throw new DefinitionLoadError('Failed to locate model "'+modelName+'" in directories:\n     >> '+failedPaths.join('\n     >> '));
            }
        }

        return schema.models[modelName];
    },
    setRootDirectory : function (directory) {
        var rootDirectory = path.resolve(path.dirname(require.main.filename),directory);
        if (rootDirectory !== this._rootDirectory) {
            this._rootDirectory = rootDirectory;
            this._resolveSearchDirectories();
        }
        return this;
    },
    addDirectory : function (directory) {
        if (typeof directory === 'string' && directory) {
            var resolvedPath = path.resolve(this._rootDirectory,directory);
            if (this._directories.indexOf(resolvedPath) === -1) {
                this._directories.push(resolvedPath);
                this._originalSearchDirectories.push(directory);
            }
        } else if (Array.isArray(directory)) {
            for (var i = 0, L = directory.length; i < L; i+=1) {
                this.addDirectory(directory[i]);
            }
        }
        return this;
    },
    _resolveSearchDirectories : function () {
        this._directories = [];
        this.addDirectory(this._originalSearchDirectories);
        return this;
    },
    _directories : null
});

module.exports = ModelLoader;
