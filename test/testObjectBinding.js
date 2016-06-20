/**
 * Created by daniel.irwin on 6/14/16.
 */

describe('test json-func w/ success/error bindings', function(){
    var jsonFunc = require('../index');
    var assert = require('assert-diff').deepEqual;
    var assert2 = require('chai').assert;

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

    var mockDataWithErrors = {
        service1 : {
            call1 : {
                data : 'hello from service1 call1',
                error : 'no hello from service1 call1'
            },
            call2: {
                data : 'hello from service1 call2',
                error : 'no hello from service1 call2'
            }
        },
        service2 : {
            call1 : {
                data : 'hello from service2 call1',
                error : 'no hello from service2 call1'
            },
            call2 : {
                data : 'hello from service2 call2',
                error : 'no hello from service2 call2'
            }
        }
    };

    var bindings = {
        'getAll'    : { data : 'service1.call1.data', error : 'service1.call1.error'},
        'addOne'    : { data : 'service1.call2.data', error : 'service1.call2.error'},
        'deleteIt'  : { data : 'service2.call1.data', error : 'service2.call1.error'},
        'updateOne' : { data : 'service2.call2.data', error : 'service2.call2.error'}
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



    //Now with Errors


    it('readme example and error', function(){

        var mock = jsonFunc(mockDataWithErrors, {
            bindings : bindings,
            async : false,
            callbacks : false,
            includeOptionArg : true,
            errOption : true
        });


        assert(mock.getAll(), 'no hello from service1 call1');
        assert(mock.addOne(), 'no hello from service1 call2');
        assert(mock.deleteIt(), 'no hello from service2 call1');
        assert(mock.updateOne(), 'no hello from service2 call2');


    });


    it('readme example but async and error', function(done){

        var mock = jsonFunc(mockDataWithErrors, {
            bindings : bindings,
            async : true,
            callbacks : false,
            includeOptionArg : false,
            errOption : false
        });


        mock.getAll(function success1(){
            assert2.fail();
        }, function(data){
            assert(data, 'no hello from service1 call1');

            mock.addOne(function success2(){
                assert2.fail();
            }, function(data){
                assert(data, 'no hello from service1 call2');

                mock.deleteIt(function success3(){
                    assert2.fail();
                }, function(data){
                    assert(data, 'no hello from service2 call1');

                    mock.updateOne(function success4(){
                        assert2.fail();
                    }, function(data){
                        assert(data, 'no hello from service2 call2');

                        done();
                    });
                });
            });
        });
    });


    it('readme example but async w/ options  and error', function(done){

        var mock = jsonFunc(mockDataWithErrors, {
            bindings : bindings,
            async : true,
            callbacks : false,
            includeOptionArg : true,
            errOption : false
        });


        mock.getAll({}, function success1(){
            assert2.fail();
        }, function(data){
            assert(data, 'no hello from service1 call1');

            mock.addOne({}, function success2(){
                assert2.fail();
            }, function(data){
                assert(data, 'no hello from service1 call2');

                mock.deleteIt({}, function success3(){
                    assert2.fail();
                }, function(data){
                    assert(data, 'no hello from service2 call1');

                    mock.updateOne({}, function success4(){
                        assert2.fail();
                    }, function(data){
                        assert(data, 'no hello from service2 call2');

                        done();
                    });
                });
            });
        });
    });



    it('readme example but async w/ options and err  and error', function(done){

        var mock = jsonFunc(mockDataWithErrors, {
            bindings : bindings,
            async : true,
            callbacks : false,
            includeOptionArg : true,
            errOption : true
        });


        mock.getAll({}, function(err, data){
            assert(err, 'no hello from service1 call1');
            assert(data, undefined);

            mock.addOne({}, function(err, data){
                assert(err, 'no hello from service1 call2');
                assert(data, undefined);
                mock.deleteIt({}, function(err, data){
                    assert(err, 'no hello from service2 call1');
                    assert(data, undefined);
                    mock.updateOne({}, function(err, data){
                        assert(err, 'no hello from service2 call2');
                        assert(data, undefined);
                        done();
                    });
                });
            });
        });
    });

});