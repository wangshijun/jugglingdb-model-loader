module.exports = function (str) {
    str = str.replace(/([A-Z])/g, function($1){return "/"+$1.toLowerCase();});
    return str.indexOf('/') === 0 ? str.replace('/','') : str;
};
