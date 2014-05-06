module.exports = function (str) {
    str.indexOf('/') !== 0 && (str = '/' + str);
    return str.replace(/(\/[a-z])/g, function($1){return $1.toUpperCase().replace('/','');});
};
