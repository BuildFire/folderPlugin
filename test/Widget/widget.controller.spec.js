/**
 * Created by zain on 13/01/16.
 */

xdescribe('folderPlugin widget: controller', function () {

    beforeEach(module('folderPluginWidget'));

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('Buildfire service', function () {

        it('Buildfire should exists', function () {
            expect(buildfire).toBeDefined();
        });
    });

    describe('Buildfire DataStore', function () {

        it('DataStore should exist and be an object', function () {
            expect(typeof buildfire.datastore).toEqual('object');
        });

        it('DataStore.getWithDynamicData should exist and be a function', function () {
            expect(typeof buildfire.datastore.getWithDynamicData).toEqual('function');
        });

        it('DataStore.onRefresh should exist and be a function', function () {
            expect(typeof buildfire.datastore.onRefresh).toEqual('function');
        });

        it('DataStore.onUpdate should exist and be a function', function () {
            expect(typeof buildfire.datastore.onUpdate).toEqual('function');
        });
    });

    describe('spy the service DataStore', function () {
        it('it should pass if DataStore getWithDynamicData service called', function () {
            spyOn(buildfire.datastore, 'getWithDynamicData').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
        });

        it('it should pass if DataStore onRefresh service called', function () {
            spyOn(buildfire.datastore, 'onRefresh').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
        });

        it('it should pass if DataStore onUpdate service called', function () {
            spyOn(buildfire.datastore, 'onUpdate').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
        });
    });

    describe('Buildfire imageLib', function () {
        it('imageLib should exist and be an object', function () {
            expect(typeof buildfire.imageLib).toEqual('object');
        });

        it('imageLib.showDialog should exist and be a function', function () {
            expect(typeof buildfire.imageLib.showDialog).toEqual('function');
        });
    });

    describe('spy the service imgaeLib', function () {
        it('it should pass if imgaeLib showDialog service called', function () {
            spyOn(buildfire.imageLib, 'showDialog').and.callFake(function() {
                return {
                    then: function (callback) {
                        return callback(result);
                    }
                };
            });
        });
    });

    describe('folderPluginCtrl', function() {
        var $scope, widgetController;

        beforeEach(function() {
            $scope = {
                $on:function(){

                }
            };
            widgetController = $controller('folderPluginCtrl', { $scope: $scope });
        });

        it('widgetController should be defined', function() {
            expect(widgetController).toBeDefined();
        });


        it('resizeImage should return background image thumbnail', function() {
            var thumbnail = $scope.resizeImage('https://www.google.com/images/srpr/logo11w.png', {width:100,height:150});
            expect(thumbnail).toEqual('http://s7obnu.cloudimage.io/s/resizenp/100x150/https://www.google.com/images/srpr/logo11w.png');
        });

        it("cropImage should  return cropped image url", function () {
            var newUrl = buildfire.imageLib.cropImage('https://www.google.com/images/srpr/logo11w.png', {width:100,height:150});
            expect(newUrl).toEqual('http://s7obnu.cloudimage.io/s/crop/100x150/https://www.google.com/images/srpr/logo11w.png');
        });

    });
});