promised-jugglingdb-model-loader
=======================

An extended JugglingDB Schema class to help with loading model definitions from separate files.

## Usage
### Example directory structure
```
index.js
model-definition /
    user.js
    user /
        profile.js
derpy-models /
    herp.js
    herp /
        derp.js
    foo /
        bar /
            baz.js
```
### JavaScript
-
#### index.js
```javascript
var SchemaWithLoader = require('promised-jugglingdb-model-loader');

var schema = new SchemaWithLoader('redis',{
    port        : 6379,
    //settings to pass to loader
    modelLoader : {
        // [optional]
        // [default] = require.main.filename
        // Will set the base directory that
        // relative "directory" properties are resolved
        // from.
        rootDirectory : '.',

        // [optional]
        // [default] = 'model-definition'
        // Will set the directory (or directories)
        // that should be searched for model
        // definitions.
        directory     : 'model-definition'

        // For multiple directories...
        directory     : [
            'model-definition',
            'derpy-modules'
        ]
    }
});


// Resolves to user.js
// is found in model-definition, meaning final path
// relative to rootDirectory is
// "model-definition/user.js"
var User = schema.loadDefinition('User');

// Resolves to user/profile.js
// is found in model-definition, meaning final path
// relative to rootDirectory is
// "model-definition/user/profile.js"
var UserProfile = schema.loadDefinition('UserProfile');

// Resolves to herp/derp.js
// is found in derpy-models, meaning final path
// relative to rootDirectory is
// "derpy-models/herp/derp.js"
var Herp = schema.loadDefinition('Herp');

// Resolves to herp/derp.js
// is found in derpy-models, meaning final path
// relative to rootDirectory is
// "derpy-models/herp/derp.js"
var HerpDerp = schema.loadDefinition('HerpDerp');

// Resolves to foo/bar/baz.js
// is found in derpy-models, meaning final path
// relative to rootDirectory is
// "derpy-models/foo/bar/baz.js"
var FooBarBaz = schema.loadDefinition('FooBarBaz');
```

Names should be camel-cased, as that defines the directory structure that the loader will be searching through.

## Definition File
### Format

The ```module.exports``` property needs to be a function that accepts one argument. This argument will be a reference to the ```SchemaWithLoader``` instance that called ```loadDefinition()```.


## Example Definition Files
#### user.js

```javascript
module.exports = function (schema) {
    var User = schema.define('User',{
        name  : String,
        email : String
    });

    return User;
};
```

#### user/profile.js

In this file, a ```UserProfile``` belongs to just one user, which means that a call to ```UserProfile.belongsTo``` is required. Since ```schema``` is an instance of ```SchemaWithLoader```, you can call ```loadDefinition('User')``` to load the ```User``` definition if it hasn't been and return it. If ```User``` has already been loaded previously, it will be returned without executing another definition loading operation.

```javascript
var Schema = require('promised-jugglingdb').Schema;

module.exports = function (schema) {
    var UserProfile = schema.define('UserProfile',{
        bio : Schema.Text
    });
    UserProfile.belongsTo(schema.loadDefinition('User'),{
        as         : 'profile',
        foreignKey : 'userId'
    });
    return UserProfile;
};
```

***TODO*** formal documentation of method calls.
