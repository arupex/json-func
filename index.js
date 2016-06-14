

// async           - enables setTimeout/process.nextTick on functions
// callbacks       - enables callback api ( if you enable async this will be forcefully enabled )
// includeOptionArg- enables first argument options parameter ( to keep API integrity
// errOption - enables err parameter in singleton callback

function arupex_json_func(jsonLiteral, options){

    if(typeof arupex_deep_value === 'undefined' && typeof require !== 'undefined'){
        arupex_deep_value = require('deep-value');
    }

    if(!options || !options.bindings){
        return;
    }

    var bindings = options.bindings;
    var async = options.async;
    var callbacks = options.callbacks;
    if(async){
        callbacks = true;
    }
    var errOption = options.errOption;
    var includeOptionArg = options.includeOptionArg;

    var runningInNode = typeof process !== 'undefined' && typeof process.nextTick === 'function';

    var implementation = {};

    function asyncer(value, cb){
        function callbackWrapper () {
            if(callbacks && typeof cb === 'function') {
                if (errOption) {
                    cb(undefined, value);
                }
                else {
                    cb(value);
                }
            }
        }

        if(async){
            if(runningInNode){
                process.nextTick(callbackWrapper);
            }
            else {
                setTimeout(callbackWrapper, 0);
            }
        }
        else {
            callbackWrapper();
            return value;
        }
    }

    function bindFunc(functionName){

        if(callbacks) {
            if (includeOptionArg) {
                implementation[functionName] = function(options, cb){
                    return asyncer(arupex_deep_value(jsonLiteral, bindings[functionName]), cb);
                }
            }
            else {
                implementation[functionName] = function(cb){
                    return asyncer(arupex_deep_value(jsonLiteral, bindings[functionName]), cb);
                }
            }
        }
        else {
            if(includeOptionArg) {
                implementation[functionName] = function(options){
                    return asyncer(arupex_deep_value(jsonLiteral, bindings[functionName]));
                }
            }
            else {
                implementation[functionName] = function(){
                    return asyncer(arupex_deep_value(jsonLiteral, bindings[functionName]));
                }
            }
        }

    }

    Object.keys(bindings).forEach(bindFunc);

    return implementation;

}


if(typeof module !== 'undefined'){
    module.exports = arupex_json_func;
}