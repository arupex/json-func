

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

    function asyncer(data, cb){
        function callbackWrapper () {
            if(callbacks && typeof cb === 'function') {
                if (errOption) {
                    cb(undefined, data);
                }
                else {
                    cb(data);
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
            return data;
        }
    }

    function asyncerWithErrors(data, err, ok, fail){
        function callbackWrapper () {
            if(callbacks && typeof ok === 'function') {
                if (errOption) {
                    if(err){
                        ok(err, undefined);
                    }
                    else {
                        ok(undefined, data);
                    }
                }
                else {
                    if(err) {
                        if(typeof fail === 'function') {
                            fail(err);
                        }
                        else {
                            ok(err);
                        }
                    }
                    else {
                        ok(data);
                    }
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
            if(err){
                return err;
            }
            return data;
        }
    }

    function bindFunc(functionName){
        var binding = bindings[functionName];

        var typeOfBinding = typeof binding;
        var data;

        if(typeOfBinding === 'string') {
            data = arupex_deep_value(jsonLiteral, binding);

            if (callbacks) {
                if (includeOptionArg) {
                    implementation[functionName] = function (options, cb) {
                        return asyncer(data, cb);
                    }
                }
                else {
                    implementation[functionName] = function (cb) {
                        return asyncer(data, cb);
                    }
                }
            }
            else {
                implementation[functionName] = function () {
                    return asyncer(data);
                }
            }
        }
        else if(typeOfBinding === 'object'){
            data = arupex_deep_value(jsonLiteral, binding.data);
            var err = arupex_deep_value(jsonLiteral, binding.error);

            if (callbacks) {
                if (includeOptionArg) {
                    implementation[functionName] = function (options, ok, fail) {
                        return asyncerWithErrors(data, err, ok, fail);
                    }
                }
                else {
                    implementation[functionName] = function (ok, fail) {
                        return asyncerWithErrors(data, err, ok, fail);
                    }
                }
            }
            else {
                implementation[functionName] = function () {
                    return asyncerWithErrors(data, err);
                }
            }
        }
        else {
            process.emit('error', new Error('I have no idea what your doing here but im going to be graceful and not fail..\n' +
                'doing nothing...\nbinding should be type of string or object with { data : string, error : string } fields'));
        }

    }

    Object.keys(bindings).forEach(bindFunc);

    return implementation;

}


if(typeof module !== 'undefined'){
    module.exports = arupex_json_func;
}