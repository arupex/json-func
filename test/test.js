/**
 * Created by daniel.irwin on 6/14/16.
 */

describe('test json-func', function(){
    var jsonFunc = require('../index');
    var assert = require('assert-diff').deepEqual;

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

    var bindings = {
        'getAll'    : 'service1.call1.data',
        'addOne'    : 'service1.call2.data',
        'deleteIt'  : 'service2.call1.data',
        'updateOne' : 'service2.call2.data'
    };

    it('readme example', function(){

        var mock = jsonFunc(mockData, {
            bindings : bindings,
            async : false,
            callbacks : false,
            includeOptionArg : true,
            errOption : true
        });


        assert(mock.getAll(), 'hello from service1 call1');
        assert(mock.addOne(), 'hello from service1 call2');
        assert(mock.deleteIt(), 'hello from service2 call1');
        assert(mock.updateOne(), 'hello from service2 call2');


    });


    it('readme example but async', function(done){

        var mock = jsonFunc(mockData, {
            bindings : bindings,
            async : true,
            callbacks : false,
            includeOptionArg : false,
            errOption : false
        });


        mock.getAll(function(data){
            assert(data, 'hello from service1 call1');

            mock.addOne(function(data){
                assert(data, 'hello from service1 call2');

                mock.deleteIt(function(data){
                    assert(data, 'hello from service2 call1');

                    mock.updateOne(function(data){
                        assert(data, 'hello from service2 call2');

                        done();
                    });
                });
            });
        });
    });


    it('readme example but async w/ options ', function(done){

        var mock = jsonFunc(mockData, {
            bindings : bindings,
            async : true,
            callbacks : false,
            includeOptionArg : true,
            errOption : false
        });


        mock.getAll({}, function(data){
            assert(data, 'hello from service1 call1');

            mock.addOne({}, function(data){
                assert(data, 'hello from service1 call2');

                mock.deleteIt({}, function(data){
                    assert(data, 'hello from service2 call1');

                    mock.updateOne({}, function(data){
                        assert(data, 'hello from service2 call2');

                        done();
                    });
                });
            });
        });
    });



    it('readme example but async w/ options and err ', function(done){

        var mock = jsonFunc(mockData, {
            bindings : bindings,
            async : true,
            callbacks : false,
            includeOptionArg : true,
            errOption : true
        });


        mock.getAll({}, function(err, data){
            assert(data, 'hello from service1 call1');

            mock.addOne({}, function(err, data){
                assert(data, 'hello from service1 call2');

                mock.deleteIt({}, function(err, data){
                    assert(data, 'hello from service2 call1');

                    mock.updateOne({}, function(err, data){
                        assert(data, 'hello from service2 call2');

                        done();
                    });
                });
            });
        });
    });

});