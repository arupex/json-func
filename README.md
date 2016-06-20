# json-func
       Have you ever needed an api that responded with specific data, say for mocking?
        Then this is the module for you!

[![npm version](https://badge.fury.io/js/json-func.svg)](https://badge.fury.io/js/json-func) [![dependencies](https://david-dm.org/arupex/json-func.svg)](http://github.com/arupex/json-func) ![Build Status](https://api.travis-ci.org/arupex/json-func.svg?branch=master) <a href='https://pledgie.com/campaigns/31873'><img alt='Pledge To Arupex!' src='https://pledgie.com/campaigns/31873.png?skin_name=chrome' border='0' ></a>


#Install

    npm install json-func --save

#Usage:

    var jsonFunc = require('json-func');

    var mockData = {
        service1 : {
            call1 : {
                data : 'hello from service1 call1'
            },
            call2: {
                data : 'hello from service1 call2'
            }
        },
        service2 : {
            call1 : {
                data : 'hello from service2 call1'
            },
            call2 : {
                data : 'hello from service2 call2'
            }
        }
    };

    var mock = jsonFunc(mockData, {
      bindings : {
        'getAll'    : 'service1.call1.data',
        'addOne'    : 'service1.call2.data',
        'deleteIt'  : 'service2.call1.data',
        'updateOne' : 'service2.call2.data'
      },
      async : true,
      callbacks : true,
      includeOptionArg : true,
      errOption : true
    });

    // async            - enables setTimeout/process.nextTick on functions
    // callbacks        - enables callback api ( if you enable async this will be forcefully enabled )
    // includeOptionArg - enables first argument options parameter ( to keep API integrity
    // errOption        - enables err parameter in singleton callback

#What you effectively get back!

    mock = {

        getAll : function,

        addOne : function,

        deleteIt : function,

        updateOne : function

    };

#Feel free to check out test/test.js for more examples

    Beware of nested callbacks #testinglazy


#Additional Usage - Note binding call1!


    var jsonFunc = require('json-func');

    var mockData = {
        service1 : {
            call1 : {
                data : 'hello from service1 call1',
                error : 'im going to do an error instead!'
            },
            call2: {
                data : 'hello from service1 call2'
            }
        },
        service2 : {
            call1 : {
                data : 'hello from service2 call1'
            },
            call2 : {
                data : 'hello from service2 call2'
            }
        }
    };

    var mock = jsonFunc(mockData, {
      bindings : {
        'getAll'    : { data : 'service1.call1.data', error : 'service1.call1.error'},
        'addOne'    : 'service1.call2.data',
        'deleteIt'  : 'service2.call1.data',
        'updateOne' : 'service2.call2.data'
      },
      async : true,
      callbacks : true,
      includeOptionArg : true,
      errOption : true
    });

#Now if you call getAll youll get an error back, in all methods/paradigms

    //fail callback
    getAll(function successcallback(){}, function failcallback(){})

    //with options
    getAll({}, function successcallback(){}, function failcallback(){})

    //err parameter
    getAll(function callback(err, data){})

    //with options
    getAll({}, function callback(err, data){})